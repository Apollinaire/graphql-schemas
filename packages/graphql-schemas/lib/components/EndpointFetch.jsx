import React from 'react';
import withIntrospection from '../modules/withIntrospection';

class EndpointFetch extends React.Component {
  state = { data: null };

  render() {
    return (
      <div>
        <pre>{JSON.stringify(this.props.introspectionSchema, null, 2)}</pre>
      </div>
    );
  }
}

export default withIntrospection()(EndpointFetch);
