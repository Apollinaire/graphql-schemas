import { getType } from 'meteor/vulcan:core';
import { fieldPermissions } from './permissions';

const schema = {
  _id: {
    type: String,
    optional: true,
    canRead: ['guests'],
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
  }
};

export default schema;
