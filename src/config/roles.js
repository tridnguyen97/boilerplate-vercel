const allRoles = {
  user: ['updateOrders', 'getOrders', 'getHistoryOrders'],
  manager: [''],
  director: [''],
  admin: [
    'getUsers',
    'manageUsers',
    'updateOrders',
    'getOrders',
    'getHistoryOrders',
    'createDirectors',
    'getDirectors',
    'updateDirectors',
    'deleteDirectors',
    'createManagers',
    'getManagers',
    'updateManagers',
    'deleteManagers',
  ],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
