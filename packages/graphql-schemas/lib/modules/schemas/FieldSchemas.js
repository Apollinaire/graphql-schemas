import SimpleSchema from 'simpl-schema';
import { getType, addTypeAndResolvers } from 'meteor/vulcan:core';
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
    ...getType('Argument')
  },
  type: {
    type: String, // only put a typename here to keep it flat.
    ...fieldPermissions,
  },
};

addTypeAndResolvers({ typeName: 'Field', schema: new SimpleSchema(schema) });
export default schema;
