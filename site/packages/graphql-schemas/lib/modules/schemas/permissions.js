import Users from 'meteor/vulcan:users';

export const fieldPermissions = {
  canRead: ['guests'],
  canCreate: ['admins'],
  canUpdate: ['admins'],
  optional: true,
};

const adminPermissions = ['schema.create', 'schema.update.all'];

Users.groups.admins.can(adminPermissions);
