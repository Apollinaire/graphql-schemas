import React from 'react';
import { render } from 'react-dom';

import GraphQLDetector from './devtools/graphqlDetector';

chrome.devtools.panels.create('GraphQL Schemas', null, 'devtools.html');
const g = new GraphQLDetector();

class App extends React.Component {
  constructor() {
    super();
    this.state = {};
    g.linkApp(this);
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