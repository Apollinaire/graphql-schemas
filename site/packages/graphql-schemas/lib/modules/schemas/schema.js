import _find from 'lodash/find';
import _sortBy from 'lodash/sortBy';
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
    resolveAs: {
      type: 'Type',
      resolver: ({ types }) => _find(types, (type) => type.name === 'Query')
    }
  },
  mutationType: {
    type: Object,
    blackbox: true,
    typeName: 'Type',
    ...fieldPermissions,
    resolveAs: {
      type: 'Type',
      resolver: ({ types }) => _find(types, (type) => type.name === 'Mutation')
    }
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
    resolveAs: {
      // type: 'Type',
      resolver: ({ types }) => _sortBy(types, 'name')
    }

  },
  'types.$': {
    type: Object,
    blackbox: true,
    typeName: 'Type',
  },
};

export default schema;
