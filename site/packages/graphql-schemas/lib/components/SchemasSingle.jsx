import React from 'react';

import { mapProps } from 'recompose';
import { registerComponent, withSingle, getFragment } from 'meteor/vulcan:core';
import DocExplorer from './DocExplorer';
import { singleSchemaFragment } from '../modules/schemas/fragments';

const singleOptions = {
  collectionName: 'Schemas',
  fragment: singleSchemaFragment,
};

const SchemasSingle = props => {
  console.log(props);
  const { document } = props;
  return document ? (
    <DocExplorer types={document.types} queryType={document.queryType} mutationType={document.mutationType} />
  ) : (
    'loading...'
  );
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
