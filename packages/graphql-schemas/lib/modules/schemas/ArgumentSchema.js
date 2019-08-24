import SimpleSchema from 'simpl-schema';
import { getType, addTypeAndResolvers } from 'meteor/vulcan:core';
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
    ...getType('Type'),
    ...fieldPermissions,
  },
};

addTypeAndResolvers({ typeName: 'Argument', schema: new SimpleSchema(schema) });
export default schema;
