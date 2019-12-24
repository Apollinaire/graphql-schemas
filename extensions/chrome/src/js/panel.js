import _ from 'underscore';
import React from 'react';
import { render } from 'react-dom';

class App extends React.Component {
  constructor() {
    super();
    this.state = {};
    // g.linkApp(this);
  }
  componentDidMount() {
    // send a message to get the state
    this.port = chrome.runtime.connect({ name: 'graphql-detector' });
    this.port.onMessage.addListener(msg => {
      if (msg?.type === 'fullCache') {
        console.log(msg)
        if(!_.isEmpty(msg.data)) {
          this.setState(msg.data);
        }
      }
      if (msg?.type === 'queryUpdate') {
        console.log(msg)
        const { hash, query } = msg.data;
        this.setState({ [hash]: query });
      }
    });
    this.port.postMessage({ type: 'getFullCache' });
  }
  componentWillUnmount() {
    this.port.disconnect();
  }

  render() {
    const queries = Object.keys(this.state).map(key => ({ key, ...this.state[key] })) || [];
    // console.log(queries);
    return (
      <div style={{ backgroundColor: 'white' }}>
        {queries.map(query => {
          return (
            <details key={query.key}>
              <summary>
                <strong>
                  {`Query ${query.requestBody.operationName} to ${query.url} `}
                  <span style={{ color: 'red' }}>{query.hits}</span>
                </strong>
              </summary>
              <pre>
                <code>{JSON.stringify(query.requestBody.variables, null, 2)}</code>
              </pre>
              <pre>
                <code>{query.requestBody.query}</code>
              </pre>
              <h2>Response</h2>
              <pre>
                <code>{JSON.stringify(query.responseBody, null, 2)}</code>
              </pre>
              <hr />
            </details>
          );
        })}
      </div>
    );
  }
}

render(<App />, document.getElementById('app-container'));
