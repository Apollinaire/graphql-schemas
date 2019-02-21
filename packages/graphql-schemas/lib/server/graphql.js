import { addGraphQLResolvers, addGraphQLQuery } from 'meteor/vulcan:core';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import gql from 'graphql-tag';

const IntrospectionQuery = gql`
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
`;

const getSchemaResolver = {
  Query: {
    async getSchema(root, args, context) {
      const { endpoint } = args;

      const client = new ApolloClient({
        ssrMode: false,
        networkInterface: createNetworkInterface({
          uri: endpoint,
          opts: { method: 'POST' },
        }),
      });
      const data = await client.query({ query: IntrospectionQuery });
      return data;
    },
  },
};

addGraphQLResolvers(getSchemaResolver);
addGraphQLQuery(`getSchema(endpoint: String): JSON`);
