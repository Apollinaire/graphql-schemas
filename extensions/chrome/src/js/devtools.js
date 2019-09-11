import React from 'react';
import { render } from 'react-dom';

import graphqlDetector from './devtools/graphqlDetector';

class App extends React.Component {
  constructor() {
    super();
    chrome.devtools.panels.create('GraphQL Schemas', null, 'devtools.html');
    this.state = {};
  }
  componentDidMount() {
    chrome.devtools.network.onRequestFinished.addListener(graphqlDetector.bind(this));
  }

  componentWillUnmount() {}

  render() {
    const queries = Object.keys(this.state).map(key => ({ key, ...this.state[key] })) || [];
    console.log(queries);
    return (
      <div style={{ backgroundColor: 'white' }}>
        {queries.map(query => {
          return (
            <div key={query.key}>
              <h2>Query</h2>
              <pre>
                <code>{JSON.stringify(query.reqBody, null, 2)}</code>
              </pre>
              <h2>Response</h2>
              <pre>
                <code>{JSON.stringify(query.resBody, null, 2)}</code>
              </pre>
            </div>
          );
        })}
      </div>
    );
  }
}

render(<App />, document.getElementById('app-container'));
