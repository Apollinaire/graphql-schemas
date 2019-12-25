import _ from 'underscore';
import { addGraphQLResolvers, addGraphQLMutation } from 'meteor/vulcan:core';
import { getIntrospectionQuery, parse } from 'graphql';
import SimpleSchema from 'simpl-schema';
import { UserInputError, ApolloError } from 'apollo-server';

import axios from 'axios';
import contributionToTypes from './contributionToTypes';

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
// addGraphQLResolvers(getSchemaResolver);
// addGraphQLQuery(`getSchema(endpoint: String!): Schema`);


const evaluateContribution = {
  Mutation: {
    evaluateContribution: async (root, {id: _id}, { Contributions }) => {
      const contribution = await Contributions.findOne({_id});
      const { query: strQuery, responseBody, url } = contribution;
      contributionToTypes(strQuery, responseBody);
      return true
    }
  }
}

addGraphQLResolvers(evaluateContribution);
addGraphQLMutation(`evaluateContribution(id: String!): Boolean`);
