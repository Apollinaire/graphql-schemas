import SimpleSchema from 'simpl-schema';
import { addTypeAndResolvers } from 'meteor/vulcan:core';
import { fieldPermissions } from './permissions';

const RestrictedType = {
  name: {
    type: String,
    ...fieldPermissions
  },
  kind: {
    type: String,
    ...fieldPermissions
  },
};

export default new SimpleSchema(RestrictedType);

addTypeAndResolvers({ typeName: 'RestrictedType', schema: new SimpleSchema(RestrictedType) });
