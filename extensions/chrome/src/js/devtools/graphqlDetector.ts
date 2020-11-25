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
    response.status === 200 &&
    ~(response.content?.mimeType || '').toLowerCase().indexOf('application/json') &&
    ~(request.postData?.mimeType || '').toLowerCase().indexOf('application/json') &&
    request.postData?.text
  );
}

class GraphQLDetector {
  constructor(shouldContribute = false) {
    this.queries = {};
    this.shouldContribute = shouldContribute;
    chrome.devtools.network.onRequestFinished.addListener(this.eventHandler);
  }
  queries: Record<string, any>;
  shouldContribute: boolean;
  App: any;

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

  queryHandler = (requestBody, responseBody, url, headers) => {
    // todo : handle errors

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
      const referer = _.find(headers, { name: 'referer' });
      // contribute to the site
      this.queryContributor(hash, requestBody.query, requestBody.variables, responseBody.data, url, referer);
    }
  };

  queryContributor = (hash, query, variables, responseBody, url, referer) => {
    if (!this.shouldContribute) {
      return;
    }

    if (~url.indexOf('localhost:')) {
      console.log('nope');
      return;
    }
    // remove arguments' values in the querystring
    const cleanQuery = queryCleaner(query);
    // remove variables values but keep the shape
    const cleanVariables = jsonCleaner(variables);
    // replace leaf values in the responseBody by their type
    const cleanResponse = jsonCleaner(responseBody);
    let cleanReferer;
    try {
      cleanReferer = referer ? new URL(referer).host : undefined;
    } catch (error) {}

    axios
      .post('http://localhost:5555/graphql', {
        operationName: 'createContributionFromExtension',
        query: `
    mutation createContributionFromExtension($query: String, $url: String, $referer: String, $responseBody: JSON, $variables: JSON) {
      createContribution(data: {query: $query, url: $url, referer: $referer responseBody: $responseBody, variables: $variables}) {
        data {
          _id
        }
      }
    }    
    `,
        variables: {
          query: cleanQuery,
          responseBody: cleanResponse,
          variables: cleanVariables,
          url: url,
          referer: cleanReferer,
        },
      })
      .then((res) => {
        console.log('uploaded contribution', res);
        // this.updateState(hash, { contributed: true });
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
}

export default GraphQLDetector;