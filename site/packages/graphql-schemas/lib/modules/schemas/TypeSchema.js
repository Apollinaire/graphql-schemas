import SimpleSchema from 'simpl-schema';
import { addTypeAndResolvers } from 'meteor/vulcan:core';
import { fieldPermissions } from './permissions';

const Type = {
  name: {
    type: String,
    ...fieldPermissions
  },
  fields: {
    type: Array,
    ...fieldPermissions
  },
  'fields.$': {
    type: Object,
    blackbox: true,
    typeName: 'Field',
    ...fieldPermissions
  },
  kind: {
    type: String,
    ...fieldPermissions
  },
  description: {
    type: String,
    ...fieldPermissions
  },
};

// console.log(Type);

export default new SimpleSchema(Type);

addTypeAndResolvers({ typeName: 'Type', schema: new SimpleSchema(Type) });
