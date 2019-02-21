import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

function withIntrospection(wrappedComponent) {
  return graphql(
    gql`
      query getIntrospectionSchema($endpoint: String) {
        getSchema(endpoint: $endpoint)
      }
    `,
    {
      alias: 'withIntrospection',
      props(props) {
        const { data } = props;
        return {
          introspectionSchema: { ...data },
        };
      },
    }
  );
}

export default withIntrospection;
