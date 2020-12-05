import _ from 'underscore';
import log from '../lib/log/devtools';
import { Query, OnSyncFunction, QueryStore } from '../types/queries';
import hashCode from './hashCode';

function isValidRequest(request, response) {
  return (
    request &&
    response &&
    request.method === 'POST' &&
    request.url &&
    response.status === 200 &&
    ~(response.content?.mimeType || '').toLowerCase().indexOf('application/json') &&
    ~(request.postData?.mimeType || '').toLowerCase().indexOf('application/json') &&
    request.postData?.text
  );
}

class GraphQLDetector {
  constructor() {
    this.queries = {};
    this.onSync = [];
    chrome.devtools.network.onRequestFinished.addListener(this.eventHandler);
  }
  queries: QueryStore;
  onSync: Array<OnSyncFunction>;

  private eventHandler = (req) => {
    if (typeof req !== 'object') return;
    const { request, response } = req;
    if (isValidRequest(request, response)) {
      // get the request
      //body of the request
      let requestBody;
      try {
        requestBody = JSON.parse(request.postData.text);
      } catch (error) {
        console.warn('could not parse request body text');
        console.error(error);
        return;
      }

      if (_.isObject(requestBody)) {
        req.getContent((responseBody) => {
          if (!responseBody) {
            return;
          }
          let parsedResponseBody;
          try {
            parsedResponseBody = JSON.parse(responseBody);
          } catch (e) {
            console.log('error parsing responseBody');
            console.log(responseBody);
            // console.log(e);
            return;
          }
          this.queryHandler(requestBody, parsedResponseBody, request.url, req.request.headers);
        });
      } else if (Array.isArray(requestBody)) {
        console.log('todo handle Apollo batch');
      }
    }
  };

  private queryHandler = (requestBody, responseBody, url, headers) => {
    // todo : handle errors

    if (
      _.isObject(requestBody) &&
      _.isString(requestBody.query) &&
      _.isString(url) &&
      _.isObject(responseBody) &&
      !_.isEmpty(responseBody.data)
    ) {
      const hash = hashCode(url + requestBody.query);

      this.updateQuery(hash, {
        requestBody,
        responseBody: responseBody.data,
        url,
      });
    }
  };

  private updateQuery = (hash: number, newState: Pick<Query, 'requestBody' | 'responseBody' | 'url'>) => {
    if (!hash || !newState) {
      return;
    }
    // set or update the local state for queries
    let udpatedQuery: Query = this.queries[hash];

    if (udpatedQuery) {
      const oldQuery = udpatedQuery;
      udpatedQuery = {
        ...oldQuery,
        hits: (oldQuery.hits || 1) + 1,
        ...newState,
      };
    } else {
      udpatedQuery = {
        hits: 1,
        ...newState,
      };
    }
    this.sync({ [hash]: udpatedQuery });
  };

  private sync = (udpatedQueries: QueryStore) => {
    this.onSync.forEach((onSync) => onSync(udpatedQueries));
  };
  public addOnSync = (onSync: OnSyncFunction) => {
    this.onSync.push(onSync);
    onSync(this.queries);
  };
}

export default GraphQLDetector;
