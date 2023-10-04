const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const prisma = require('../prisma');
const ApiError = require('../utils/ApiError');

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
const isEmailTaken = async (userEmail, excludeUserId) => {
  const user = await prisma.users.findUnique({
    where: {
      email: userEmail,
      NOT: {
        id: excludeUserId !== undefined ? excludeUserId : undefined,
      },
    },
  });
  return !!user;
};
/**
 * Check if password matches the user's password
 * @param {string} userPassword - password of user
 * @param {string} password - password needed to check
 * @returns {Promise<boolean>}
 */
const isPasswordMatch = async (userPassword, password) => {
  return bcrypt.compare(password, userPassword);
};

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  // eslint-disable-next-line no-param-reassign
  userBody.password = await bcrypt.hash(userBody.password, 8);
  return prisma.users.create({
    data: userBody,
  });
};

/**
 * Get all users with pagination, filtering and sorting
 * @param {Object} filter - SQL filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const getUsers = async (filter, options) => {
  let sort = '';
  const DEFAULT_SORT = {
    createdAt: 'desc',
  };
  if (options.sortBy) {
    const sortingCriteria = [];
    options.sortBy.split(',').forEach((sortOption) => {
      const [key, order] = sortOption.split(':');
      sortingCriteria.push(JSON.parse(`${key}: ${order}`));
    });
  } else {
    sort = DEFAULT_SORT;
  }
  const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10;
  const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
  const skip = (page - 1) * limit;

  const users = await prisma.users.findMany({
    skip,
    take: limit,
    where: filter,
    orderBy: sort,
  });
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return prisma.users.findUnique({
    where: { id },
  });
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return prisma.users.findUnique({
    where: { email },
  });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

const createAnonUser = async (userBody) => {
  return prisma.anonymousUsers.create({
    data: userBody,
  });
};
const getAnonUserByName = async (name) => {
  return prisma.anonymousUsers.findMany({
    where: {
      nickname: {
        contains: name,
      },
    },
  });
};

module.exports = {
  isPasswordMatch,
  createUser,
  getUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  createAnonUser,
  getAnonUserByName,
};
