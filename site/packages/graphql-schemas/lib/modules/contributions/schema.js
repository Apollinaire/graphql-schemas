import SimpleSchema from 'simpl-schema';

const schema = {
  _id: {
    type: String,
    label: 'ID',
    optional: true,
    canRead: ['admin'],
  },
  createdAt: {
    type: Date,
    optional: true,
    canRead: ['admin'],
    onCreate: () => {
      return new Date();
    },
  },
  userId: {
    type: String,
    optional: true,
    canRead: ['admin'],
    canUpdate: ['admin'],
    resolveAs: {
      fieldName: 'user',
      type: 'User',
      resolver: (parent, args, context) => {
        if (!parent || !parent.userId) {
          return null
        }
        const user = context.Users.loader.load(parent.userId);
        const viewableFields = context.Users.getViewableFields(context.currentUser, context.Users);
        if (viewableFields) {
          const result = {};
          viewableFields.forEach(fieldName => {
            result[fieldName] = user[fieldName];
          });
          return result;
        }
        return null;
      },
      addOriginalField: true,
    },
  },
  query: {
    type: String,
    label: 'query',
    optional: false,
    canRead: ['admin'],
    canCreate: ['guests'],
    canUpdate: ['admin'],
  },
  responseBody: {
    type: Object,
    blackbox: true,
    label: 'ResponseBody',
    optional: false,
    canRead: ['admin'],
    canCreate: ['guests'],
    canUpdate: ['admin'],
  },
  url: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    label: 'Url',
    optional: false,
    canRead: ['admin'],
    canCreate: ['guests'],
    canUpdate: ['admin'],
  },
}

export default schema;