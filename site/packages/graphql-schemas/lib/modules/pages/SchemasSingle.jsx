import React from 'react';

import { mapProps } from 'recompose';
import { registerComponent, withSingle } from 'meteor/vulcan:core';
import DocExplorer from '../../components/DocExplorer';
import { singleSchemaFragment } from '../schemas/fragments';

const singleOptions = {
  collectionName: 'Schemas',
  fragment: singleSchemaFragment,
};

const SchemasSingle = props => {
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
