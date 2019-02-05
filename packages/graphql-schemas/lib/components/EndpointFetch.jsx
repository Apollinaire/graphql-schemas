import React from 'react';

const IntrospectionQuery = `
query IntrospectionQuery {
  __schema {
    queryType {
      name
    }
    mutationType {
      name
    }
    subscriptionType {
      name
    }
    types {
      ...FullType
    }
    directives {
      name
      description
      args {
        ...InputValue
      }
      onOperation
      onFragment
      onField
    }
  }
}

fragment FullType on __Type {
  kind
  name
  description
  fields(includeDeprecated: true) {
    name
    description
    args {
      ...InputValue
    }
    type {
      ...TypeRef
    }
    isDeprecated
    deprecationReason
  }
  inputFields {
    ...InputValue
  }
  interfaces {
    ...TypeRef
  }
  enumValues(includeDeprecated: true) {
    name
    description
    isDeprecated
    deprecationReason
  }
  possibleTypes {
    ...TypeRef
  }
}

fragment InputValue on __InputValue {
  name
  description
  type {
    ...TypeRef
  }
  defaultValue
}

fragment TypeRef on __Type {
  kind
  name
  ofType {
    kind
    name
    ofType {
      kind
      name
      ofType {
        kind
        name
      }
    }
  }
}
`

class EndpointFetch extends React.Component {
  state = { data: null };

  componentDidMount() {
    fetch('https://facebook.com/api/graphql', {
      mode: 'no-cors',
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: IntrospectionQuery
    })
      .then(response => response.json())
      .then(data => this.setState({ data }));
  }

  render() {
    return JSON.stringify(this.state.data, null, 2);
  }
}

export default EndpointFetch;
