const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const prisma = require('../prisma');
const ApiError = require('../utils/ApiError');
const { getRandomName } = require('../utils/contact.helper');

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
  return prisma.users.findMany({
    filter,
    options,
  });
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
  return prisma.users.update({
    where: {
      id: user.id,
    },
    data: updateBody,
  });
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
  await prisma.users.delete({
    where: {
      id: user.id,
    },
  });
  return user;
};

const createAnonUser = async (userBody) => {
  const { deviceId } = userBody;
  const payload = {
    deviceId,
    nickname: getRandomName(),
  };
  return prisma.anonymousUsers.create({
    data: payload,
  });
};

const getAnonUserByName = async (filter, options) => {
  return prisma.anonymousUsers.findMany({
    filter,
    options,
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
