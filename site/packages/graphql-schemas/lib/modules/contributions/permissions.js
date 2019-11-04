import Users from 'meteor/vulcan:users';

const adminPermissions = ['contribution.create', 'contribution.update.all'];
const guestPermissions = ['contribution.create'];

Users.groups.admins.can(adminPermissions);
Users.groups.guests.can(guestPermissions);
