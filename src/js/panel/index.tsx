import _ from 'underscore';
import React from 'react';
import { render } from 'react-dom';
import log from '../common/log/panel';

interface Query {
  hits: number;
  url: string;
  requestBody: any;
  responseBody: any;
}

interface State {
  [key: string]: Query;
}

class App extends React.Component<{}, State> {
  render() {
    log("hi hi")
    // const queries = Object.keys(this.state).map((key) => ({ key, ...this.state[key] })) || [];
    // console.log(queries);
    return (
      <div style={{ backgroundColor: 'white' }}>
        Hi there
        {/* {queries.map((query) => {
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
        })} */}
      </div>
    );
  }
}

const panel = () => {
  render(<App />, document.getElementById('app-container'));
};

export default panel;
