import _ from 'underscore';
import React from 'react';
import { render } from 'react-dom';
import { Query, OnSyncFunction } from '../types/queries';
import log from '../lib/log/panel';

interface State {
  queries: { [key: string]: Query };
}

class App extends React.Component<{}, State> {
  constructor(props) {
    super(props);
    this.state = {
      queries: {},
    };
    const onSync: OnSyncFunction = (modifiedQueries) => {
      this.setState((prevState) => ({
        ...prevState,
        queries: {
          ...prevState.queries,
          ...modifiedQueries,
        },
      }));
    };
    (window as any).__GRAPQHL_EXTENSION__SYNC__ = onSync;
  }

  render() {
    // const queries = Object.keys(this.state).map((key) => ({ key, ...this.state[key] })) || [];
    // console.log(queries);
    log(this.state);
    return (
      <div style={{ backgroundColor: 'white' }}>
        Hi there :)
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
