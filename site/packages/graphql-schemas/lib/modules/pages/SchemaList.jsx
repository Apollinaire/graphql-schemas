import React from 'react'
import gql from 'graphql-tag';
import { Link } from 'react-router-dom';
import { registerComponent, withMulti, Components } from 'meteor/vulcan:core';

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
          return <li key={index}><Link to={`/s/${schema.slug}`} >{schema.endpoint}</Link></li>;
        })}
      </ul>
    </div>
  );
};

registerComponent({ name: 'SchemaList', component: SchemaList, hocs: [[withMulti, multiOptions]] });
