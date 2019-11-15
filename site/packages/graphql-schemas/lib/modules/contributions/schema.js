import SimpleSchema from 'simpl-schema';

const schema = {
  _id: {
    type: String,
    label: 'ID',
    optional: true,
    canRead: ['admins'],
  },
  createdAt: {
    type: Date,
    optional: true,
    canRead: ['admins'],
    onCreate: () => {
      return new Date();
    },
  },
  userId: {
    type: String,
    optional: true,
    canRead: ['admins'],
    canUpdate: ['admins'],
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
    canRead: ['admins'],
    canCreate: ['guests'],
    canUpdate: ['admins'],
  },
  responseBody: {
    type: Object,
    blackbox: true,
    label: 'ResponseBody',
    optional: false,
    canRead: ['admins'],
    canCreate: ['guests'],
    canUpdate: ['admins'],
  },
  url: {
    type: String,
    // regEx: SimpleSchema.RegEx.Url, // TODO : restaure this
    label: 'Url',
    optional: false,
    canRead: ['admins'],
    canCreate: ['guests'],
    canUpdate: ['admins'],
  },
}

export default schema;