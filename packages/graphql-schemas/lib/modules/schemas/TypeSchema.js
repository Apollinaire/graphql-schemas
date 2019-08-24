import SimpleSchema from 'simpl-schema';
import { getType, addTypeAndResolvers } from 'meteor/vulcan:core';
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
    ...getType('Field'), // todo: improve here
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
