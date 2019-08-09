import SimpleSchema from 'simpl-schema';

const schema = {
  _id: {
    type: String,
    optional: true,
    canRead: ['guests']
  },
  createdAt: {
    type: Date,
    optional: true,
    canRead: ['guests'],
    onCreate: () => new Date(),
  },
  endpoint: {
    type: String,
    optional: false,
    canRead: ['guests'],
    searchable: true,
  },
};

export default schema;
