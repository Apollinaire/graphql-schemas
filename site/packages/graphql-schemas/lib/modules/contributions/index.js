/*
 * Contributions are the raw data provided by the extension
 */
import { createCollection, getDefaultResolvers, getDefaultMutations } from 'meteor/vulcan:core';
import schema from './schema';
import './permissions';

const Contributions = createCollection({
  collectionName: 'Contributions',
  typeName: 'Contribution',
  schema: schema,
  resolvers: getDefaultResolvers({ typeName: 'Contribution' }),
  mutations: getDefaultMutations({ typeName: 'Contribution' }),
});

export default Contributions;
