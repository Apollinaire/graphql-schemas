import _ from 'underscore';
import slugify from 'slugify';
import { addGraphQLResolvers, addGraphQLMutation } from 'meteor/vulcan:core';
import { getIntrospectionQuery, parse } from 'graphql';
import SimpleSchema from 'simpl-schema';
import { UserInputError, ApolloError } from 'apollo-server';

import axios from 'axios';
import contributionToTypes, { objectToArrayTypes, arrayToObjectTypes, mergeTypes } from './contributionToTypes';

const introspectionQuery = getIntrospectionQuery({ descriptions: true });

const getSchemaResolver = {
  Query: {
    async getSchema(root, args, context) {
      const { endpoint } = args;

      // validate endpoint
      // if (!SimpleSchema.RegEx.Url.test(endpoint)) {
      //   throw new UserInputError('Invalid endpoint')
      // }
      let __schema = {};
      try {
        const introspectionResult = await axios.post(endpoint, {
          query: introspectionQuery,
        });
        if (introspectionResult.data && introspectionResult.data.data) {
          __schema = introspectionResult.data.data.__schema;
        } else {
          throw Error('no schema');
        }
      } catch (error) {
        throw new ApolloError(error.message);
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
    evaluateContribution: async (root, { id: _id }, { Contributions, Schemas }) => {
      const contribution = await Contributions.findOne({ _id });
      const { query, responseBody, url } = contribution;
      const types = contributionToTypes(query, responseBody);
      // console.log(JSON.stringify(objectToArrayTypes(types), null, 2))
      const schema = await Schemas.findOne({ endpoint: url });
      console.log('schema', schema)
      if (!schema) {
        // create new one
        const newSchema = {
          slug: slugify(url),
          endpoint: url,
          types: objectToArrayTypes(types),
        };
        console.log('create new schema')
        await Schemas.insert(newSchema);
      } else {
        console.log('update existing schema');
        // merge types
        const newTypes = objectToArrayTypes(mergeTypes(arrayToObjectTypes(schema.types), types));
        console.log(newTypes)
        await Schemas.update({ _id: schema._id }, { $set: { types: newTypes } });
      }
      return true;
    },
  },
};

addGraphQLResolvers(evaluateContribution);
addGraphQLMutation(`evaluateContribution(id: String!): Boolean`);
