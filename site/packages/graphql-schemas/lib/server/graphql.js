import { addGraphQLResolvers, addGraphQLQuery } from 'meteor/vulcan:core';
import { getIntrospectionQuery } from 'graphql';
import SimpleSchema from 'simpl-schema';
import { UserInputError, ApolloError } from 'apollo-server';

import axios from 'axios';

const introspectionQuery = getIntrospectionQuery({descriptions: true})

const getSchemaResolver = {
  Query: {
    async getSchema(root, args, context) {
      const { endpoint } = args;

      // validate endpoint
      // if (!SimpleSchema.RegEx.Url.test(endpoint)) {
      //   throw new UserInputError('Invalid endpoint') 
      // }
      let __schema = {}
      try {
        const introspectionResult = await axios.post(endpoint, {
          query: introspectionQuery,
        });
        if (introspectionResult.data && introspectionResult.data.data) {
          __schema = introspectionResult.data.data.__schema
        } else {
          throw Error('no schema')
        }
      } catch (error) {
        throw new ApolloError(error.message)
      }
      // validate schema
      
      return __schema;
    },
  },
};
// https://graphql-pokemon.now.sh
addGraphQLResolvers(getSchemaResolver);
addGraphQLQuery(`getSchema(endpoint: String!): Schema`);
