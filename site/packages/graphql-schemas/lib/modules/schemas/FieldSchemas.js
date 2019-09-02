import SimpleSchema from 'simpl-schema';
import { getType, addTypeAndResolvers } from 'meteor/vulcan:core';
import { fieldPermissions } from './permissions';

import RestrictedType from './RestrictedTypeSchema';

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
    ...getType('RestrictedType'), // avoid deep recursions
    ...fieldPermissions,
  },
};

addTypeAndResolvers({ typeName: 'Field', schema: new SimpleSchema(schema) });
export default schema;
