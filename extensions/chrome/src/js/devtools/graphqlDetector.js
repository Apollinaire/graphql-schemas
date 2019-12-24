import _ from 'underscore';
import hashCode from './hashCode';
import axios from 'axios';
import jsonCleaner from './jsonCleaner';
import queryCleaner from './queryCleaner';

function isValidRequest(request, response) {
  return (
    request &&
    response &&
    request.method === 'POST' &&
    request.url &&
    !~request.url.indexOf('localhost:') &&
    response.status === 200 &&
    ((response.content || {}).mimeType || '').toLowerCase() === 'application/json' &&
    ((request.postData || {}).mimeType || '').toLowerCase() === 'application/json' &&
    (request.postData || {}).text
  );
}

class GraphQLDetector {
  constructor() {
    this.queries = {};
    chrome.devtools.network.onRequestFinished.addListener(this.eventHandler);
  }
  eventHandler = (req) => {
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
          if(!responseBody) {
            return;
          }
          console.log(requestBody,responseBody, request.url, '\n')
          let paresedResponseBody;
          try {
            paresedResponseBody = JSON.parse(responseBody);
          } catch (e) {
            console.log('error parsing responseBody');
            // console.log(responseBody)
            // console.log(e);
            return;
          }
          this.queryHandler(requestBody, paresedResponseBody, request.url);
        });
      }
    }
  };

  queryHandler = (requestBody, responseBody, url) => {
    // todo : handle errors
    // todo : handle authorization header
    if (
      _.isObject(requestBody) &&
      _.isString(requestBody.query) &&
      _.isString(url) &&
      _.isObject(responseBody) &&
      !_.isEmpty(responseBody.data)
    ) {
      const hash = hashCode(url + requestBody.query);

      this.updateState(hash, {
        requestBody,
        responseBody: responseBody.data,
        url,
      });

      // contribute to the site
      this.queryContributor(hash, requestBody.query, responseBody.data, url);
    }
  };

  queryContributor = (hash, query, responseBody, url) => {
    // remove arguments' values in the querystring
    const cleanQuery = queryCleaner(query);
    // replace leaf values in the responseBody by their type
    const cleanResponse = jsonCleaner(responseBody);
    axios
      .post('http://localhost:5555/graphql', {
        operationName: 'createContributionFromExtension',
        query: `
    mutation createContributionFromExtension($query: String, $url: String, $responseBody: JSON) {
      createContribution(data: {query: $query, url: $url, responseBody: $responseBody}) {
        data {
          _id
        }
      }
    }    
    `,
        variables: {
          query: cleanQuery,
          responseBody: cleanResponse,
          url: url,
        },
      })
      .then((res) => {
        this.updateState(hash, { contributed: true });
      })
      .catch((e) => {
        console.log('error in contribution');
        console.log(e);
      });
  };

  updateState = (hash, newState) => {
    if (!hash || !newState) {
      return;
    }
    // set or update the local state for queries
    if (this.queries[hash]) {
      const oldQuery = this.queries[hash];
      this.queries[hash] = {
        ...oldQuery,
        hits: (oldQuery.hits || 1) + 1,
        ...newState,
      };
    } else {
      this.queries[hash] = {
        hits: 1,
        ...newState,
      };
    }
    // update the app state
    if (this.App && _.isFunction(this.App.setState)) {
      this.App.setState({ [hash]: this.queries[hash] });
    }
    if (this.port) {
      this.port.postMessage({
        type: 'queryUpdate',
        data: {
          hash,
          query: this.queries[hash],
        },
        tabId: chrome.devtools.inspectedWindow.tabId,
      });
    }
  };

  linkApp = (component) => {
    this.App = component;
    if (!_.isEmpty(this.queries)) {
      this.App.state = {
        ...this.App.state,
        ...this.queries,
      };
    }
  };

  linkPort = (port) => {
    this.port = port;
    port.onMessage.addListener((msg) => {
      if (msg?.tabId === chrome.devtools.inspectedWindow.tabId) {
        if (msg?.type === 'getFullCache') {
          port.postMessage({
            type: 'fullCache',
            data: this.getFullCache(),
            tabId: chrome.devtools.inspectedWindow.tabId,
          });
        }
      }
    });
  };

  getFullCache = () => {
    return this.queries;
  };
}

export default GraphQLDetector;
