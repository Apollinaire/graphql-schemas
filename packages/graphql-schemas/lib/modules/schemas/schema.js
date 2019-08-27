import { getType, Utils } from 'meteor/vulcan:core';
import { fieldPermissions } from './permissions';
import SimpleSchema from 'simpl-schema';

const schema = {
  _id: {
    type: String,
    optional: true,
    canRead: ['guests'],
  },
  slug: {
    type: String,
    optional: true,
    canRead: ['guests'],
    onCreate: ({ document = {} }) => {
      const { endpoint, _id } = document;
      if(!endpoint) return _id;
      const basicSlug = Utils.slugify(endpoint);
      return Utils.getUnusedSlugByCollectionName('Schemas', basicSlug)
    }
  },
  endpoint: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    optional: false,
    searchable: true,
    ...fieldPermissions,
  },
  queryType: {
    ...getType('Type'),
    ...fieldPermissions,
  },

  mutationType: {
    ...getType('Type'),
    ...fieldPermissions,
  },

  subscriptionType: {
    ...getType('Type'),
    ...fieldPermissions,
  },
  types: {
    type: Array,
    ...fieldPermissions,
  },
  'types.$': {
    ...getType('Type'),
  },
};

export default schema;
