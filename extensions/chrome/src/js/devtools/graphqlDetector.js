import _ from 'underscore';
import hashCode from './hashCode';

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
          this.queryHandler(requestBody, responseBody, request.url);
        });
      }
    }
  };

  queryHandler = (requestBody, responseBody, url) => {
    if (_.isObject(requestBody) && _.isString(requestBody.query)) {
      const hash = hashCode(requestBody.query);
      this.queries[hash] = {
        requestBody,
        responseBody,
        url,
      };
      if (this.App && _.isFunction(this.App.setState)) {
        this.App.setState({ [hash]: { requestBody, responseBody, url } });
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
