import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core';
import schema from './schema';
import './TypeSchema';
import './FieldSchemas';
import './ArgumentSchema';

const Schemas = createCollection({
  collectionName: 'Schemas',
  typeName: 'Schema',
  schema: schema,
  resolvers: getDefaultResolvers({ typeName: 'Schema' }),
  mutations: getDefaultMutations({ typeName: 'Schema' }),
});

export default Schemas;
