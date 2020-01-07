import { Utils } from 'meteor/vulcan:core';
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
    type: Object,
    blackbox: true,
    typeName: 'Type',
    ...fieldPermissions,
  },
  mutationType: {
    type: Object,
    blackbox: true,
    typeName: 'Type',
    ...fieldPermissions,
  },

  subscriptionType: {
    type: Object,
    blackbox: true,
    typeName: 'Type',
    ...fieldPermissions,
  },
  types: {
    type: Array,
    ...fieldPermissions,
  },
  'types.$': {
    type: Object,
    blackbox: true,
    typeName: 'Type',
  },
};

export default schema;
