import SimpleSchema from 'simpl-schema';
import { addTypeAndResolvers, getType } from 'meteor/vulcan:core';
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
    ...getType('RestrictedType'),
    ...fieldPermissions,
  },
};

addTypeAndResolvers({ typeName: 'Argument', schema: new SimpleSchema(schema) });
export default schema;
