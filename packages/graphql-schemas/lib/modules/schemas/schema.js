import TypeSchema from './TypeSchema';

const schema = {
  _id: {
    type: String,
    optional: true,
    canRead: ['guests'],
  },
  fieldOne: {
    type: TypeSchema,
    canRead: ['guests'],
    canCreate: ['admin'],
  },
  fieldTwo: {
    type: TypeSchema,
    canRead: ['guests'],
    canCreate: ['admin'],
    canUpdate: ['admin']
  },
  fieldThree: {
    type: Array,
    canRead: ['guests'],
  },
  'fieldThree.$': {
    type: TypeSchema,
  },
};

export default schema;
