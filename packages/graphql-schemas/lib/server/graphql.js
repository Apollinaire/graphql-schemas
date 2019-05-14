import { addGraphQLResolvers, addGraphQLQuery } from 'meteor/vulcan:core';
import { introspectionQuery } from 'graphql';

import axios from 'axios';
// import gql from 'graphql-tag';

const getSchemaResolver = {
  Query: {
    async getSchema(root, args, context) {
      const { endpoint } = args;

      // const client = new ApolloClient({
      //   ssrMode: false,
      //   networkInterface: createNetworkInterface({
      //     uri: endpoint,
      //     opts: { method: 'POST' },
      //   }),
      // });
      console.log('in getschema');

      const { data = {}, headers, status } = await axios.post('https://sidebar.io/graphql', {
        query: introspectionQuery,
      });
      console.log(headers);
      console.log(status);
      return data.data;
    },
  },
};

addGraphQLResolvers(getSchemaResolver);
addGraphQLQuery(`getSchema(endpoint: String!): JSON`);
