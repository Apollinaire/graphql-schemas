import SimpleSchema from 'simpl-schema';
import { addTypeAndResolvers } from 'meteor/vulcan:core';
import {fieldPermissions} from './permissions';

const schema = {
  name: {
    type: String,
    ...fieldPermissions,
  },
  description: {
    type: String,
    ...fieldPermissions,
  },
  type: {
    type: Object,
    typeName: 'RestrictedType',
    blackbox: true,
    ...fieldPermissions,
  },
};

addTypeAndResolvers({ typeName: 'Argument', schema: new SimpleSchema(schema) });
export default schema;