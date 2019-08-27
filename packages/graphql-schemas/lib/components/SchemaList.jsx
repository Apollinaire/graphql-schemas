import React from 'react'

import { registerComponent, withMulti } from 'meteor/vulcan:core';
import gql from 'graphql-tag';

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
  fragment: multiFragment,
};

const SchemaList = ({ loading, error, results, totalCount }) => {
  if (loading) return <Components.Loading />;
  if (error) return <pre>error: {JSON.stringify(error, null, 2)}</pre>;
  return (
    <div>
      <p>{`total: ${totalCount}`}</p>
      <ul>
        {(results || []).map(function(schema, index) {
          return <li key={index}>{schema.endpoint}</li>;
        })}
      </ul>
    </div>
  );
};

registerComponent({ name: 'SchemaList', component: SchemaList, hocs: [[withMulti, multiOptions]] });
