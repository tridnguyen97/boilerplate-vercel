const allRoles = {
  user: ['updateOrders', 'getOrders', 'getHistoryOrders', 'getUserBalance'],
  admin: ['getUsers', 'manageUsers', 'updateOrders', 'getOrders', 'getHistoryOrders', 'getUserBalance'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
