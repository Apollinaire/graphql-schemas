import React from 'react';
import gql from 'graphql-tag';
import { mapProps } from 'recompose';
import { registerComponent, withSingle } from 'meteor/vulcan:core';
import DocExplorer from './DocExplorer';

const singleFragment = gql`
  fragment singleSchema on Schema {
    _id
    slug
    endpoint
    queryType {
      name
      fields {
        name
      }
    }
    mutationType {
      name
      fields {
        name
      }
    }
    types {
      name
      fields {
        name
      }
    }
  }
`;

const singleOptions = {
  collectionName: 'Schemas',
  fragment: singleFragment,
};

const SchemasSingle = props => {
  console.log(props);
  const { document } = props;
  return <DocExplorer types={document.types} queryType={document.queryType} mutationType={document.mutationType} />;
};
const propsMapper = props => ({
  ...props,
  slug: props.match.params.slug,
});

registerComponent({
  name: 'SchemasSingle',
  component: SchemasSingle,
  hocs: [mapProps(propsMapper), [withSingle, singleOptions]],
});
