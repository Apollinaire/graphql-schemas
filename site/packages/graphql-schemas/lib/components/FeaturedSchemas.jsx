import React from 'react';
import _map from 'lodash/map';
import gql from 'graphql-tag';
import { registerComponent, withMulti } from 'meteor/vulcan:core';
import SchemaCard from './SchemaCard';

const FeaturedSchemas = ({ results }) => {
  return (
    <div>
      {_map(results, (schema) => <SchemaCard schema={schema} key={schema._id}/>)}
    </div>
  );
};

const multiFragment = gql`
  fragment multiSchema on Schema {
    _id
    slug
    endpoint
    queryType {
      name
      fields {
        name
      }
    }
  }
`;

const multiOptions = {
  collectionName: 'Schemas',
  operationName: 'featuredSchemas',
  fragment: multiFragment,
};

registerComponent({ name: 'FeaturedSchemas', component: FeaturedSchemas, hocs: [[withMulti, multiOptions]] });
