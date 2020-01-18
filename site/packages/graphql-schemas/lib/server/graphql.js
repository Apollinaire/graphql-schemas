import _ from 'underscore';
import slugify from 'slugify';
import { addGraphQLResolvers, addGraphQLMutation } from 'meteor/vulcan:core';
import { getIntrospectionQuery, parse } from 'graphql';
import SimpleSchema from 'simpl-schema';
import { UserInputError, ApolloError } from 'apollo-server';
import axios from 'axios';

import './additionalTypes';

import contributionToTypes, { objectToArrayTypes, arrayToObjectTypes, mergeTypes } from './contributionToTypes';
import treatOneContribution from './treatOneContribution';

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

const newResolvers = {
  Mutation: {
    evaluateContribution: async (root, { id: _id }, { Contributions, Schemas }) => {
      return treatOneContribution(_id, { Contributions, Schemas });
      const contribution = await Contributions.findOne({ _id });
      const { query, responseBody, url } = contribution;
      const types = contributionToTypes(query, responseBody);
      const schema = await Schemas.findOne({ endpoint: url });
      if (!schema) {
        // create new one
        const newSchema = {
          slug: slugify(url),
          endpoint: url,
          types: objectToArrayTypes(types),
        };
        await Schemas.insert(newSchema);
      } else {
        // merge types
        const newTypes = objectToArrayTypes(mergeTypes(arrayToObjectTypes(schema.types), types));
        await Schemas.update({ _id: schema._id }, { $set: { types: newTypes } });
      }
      return true;
    },
    evaluateAllContributions: async (root, args, { Contributions, Schemas }) => {
      const t = Date.now();
      const allContributions = await Contributions.find({}, { fields: { _id: 1 } }).fetch();
      console.log('all contributions: ', allContributions.length);
      for (const contribution of allContributions) {
        await treatOneContribution(contribution._id, { Contributions, Schemas });
      }
      console.log('total time to evaluate all: ', Date.now() - t, 'ms');
      return true;
    },
  },
};

addGraphQLResolvers(newResolvers);
addGraphQLMutation(`evaluateContribution(id: String!): Boolean`);
addGraphQLMutation(`evaluateAllContributions: Boolean`);
