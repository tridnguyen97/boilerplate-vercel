const allRoles = {
  user: ['updateOrders', 'getOrders', 'getHistoryOrders', 'getUserBalance', 'createBanks', 'getBanks'],
  manager: [''],
  director: ['getUsers', 'getManagers', 'manageUserBalance', 'manageUserSubscription'],
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
    'createBanks',
    'getBanks',
  ],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
