import SimpleSchema from 'simpl-schema';
import {addType } from 'meteor/vulcan:lib'

const Type = {
  fields: {
    type: Array,
    canRead: ['guests'],
    canCreate: ['admin'],
    canUpdate: ['admin'],
    optional: true,
  },
  'fields.$': {
    type: String, // todo: improve here
    canRead: ['guests'],
  },
  kind: {
    type: String,
    canRead: ['guests'],
    canCreate: ['admin'],
    canUpdate: ['admin'],
    optional: true,
  },
  name: {
    type: String,
    canRead: ['guests'],
    optional: true,
  },
  description: {
    type: String,
    canRead: ['guests'],
    optional: true,
  },
};

export default new SimpleSchema(Type);

addType({typeName: 'TestSchema', schema: (new SimpleSchema(Type)._schema)})