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

function graphqlDetector(req) {
  if (typeof req !== 'object') return;
  const { request, response } = req;
  if (isValidRequest(request, response)) {
    // get the request
    //body of the request
    let reqBody = {};
    try {
      reqBody = JSON.parse(request.postData.text);
    } catch (error) {
      console.warn('could not parse request body text');
      console.error(error);
      return;
    }

    if (typeof reqBody.query === 'string') {
      // create hash
      const hash = hashCode(reqBody.query);
      // save to state

      // this.setState({ url: request.url, reqBody });

      // save the response body
      req.getContent(body => {
        this.setState({
          [hash]: {
            url: request.url,
            reqBody,
            resBody: JSON.parse(body),
          },
        });
      });
    }
  }
}

export default graphqlDetector;
