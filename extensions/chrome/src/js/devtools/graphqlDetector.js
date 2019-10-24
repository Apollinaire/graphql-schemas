import _ from 'underscore';
import hashCode from './hashCode';
import axios from 'axios';

function isValidRequest(request, response) {
  return (
    request &&
    response &&
    request.method === 'POST' &&
    request.url &&
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
  eventHandler = req => {
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
        req.getContent(responseBody => {
          this.queryHandler(requestBody, JSON.parse(responseBody), request.url);
        });
      }
    }
  };

  queryHandler = (requestBody, responseBody, url) => {
    if (_.isObject(requestBody) && _.isString(requestBody.query) && _.isString(url)) {
      const hash = hashCode(url + requestBody.query);
      if (this.queries[hash]) {
        this.queries[hash] = {
          requestBody,
          responseBody,
          url,
          hits: (this.queries[hash].hits || 1) + 1,
        };
      } else {
        this.queries[hash] = {
          requestBody,
          responseBody,
          url,
          hits: 1,
        };
      }
      if (this.App && _.isFunction(this.App.setState)) {
        this.App.setState({ [hash]: this.queries[hash] });
      }
    }
  };

  linkApp = component => {
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
