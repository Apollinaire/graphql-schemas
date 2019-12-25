import SimpleSchema from 'simpl-schema';
import { addTypeAndResolvers } from 'meteor/vulcan:core';
import { fieldPermissions } from './permissions';


const schema = {
  name: {
    type: String,
    ...fieldPermissions,
  },
  description: {
    type: String,
    ...fieldPermissions,
  },
  args: {
    type: Array,
    ...fieldPermissions,
  },
  'args.$': {
    type: Object,
    typeName: 'Argument',
    blackbox: true,
  },
  isListType: {
    type: Boolean,
    ...fieldPermissions,
  },
  isNullableType: {
    type: Boolean,
    ...fieldPermissions,
  },
  type: {
    type: Object,
    blackbox: true,
    typeName: 'RestrictedType',
    ...fieldPermissions,
  },
};

addTypeAndResolvers({ typeName: 'Field', schema: new SimpleSchema(schema) });
export default schema;
