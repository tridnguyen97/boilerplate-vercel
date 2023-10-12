const allRoles = {
  user: ['updateOrders', 'getOrders', 'getHistoryOrders'],
  admin: ['getUsers', 'manageUsers', 'updateOrders', 'getOrders', 'getHistoryOrders'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
