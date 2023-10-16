const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const prisma = require('../prisma');
const ApiError = require('../utils/ApiError');
const { getRandomName, getRandomColor } = require('../utils/contact.helper');

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
 * Check if user is taken
 * @param {string} user - The user's name
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
const isNameTaken = async (username, excludeUserId) => {
  const user = await prisma.users.findUnique({
    where: {
      name: username,
      NOT: {
        id: excludeUserId !== undefined ? excludeUserId : undefined,
      },
    },
  });
  return !!user;
};

/**
 * Get user by name
 * @param {ObjectId} name
 * @returns {Promise<User>}
 */
const getUserByName = async (name) => {
  return prisma.users.findUnique({
    where: { name },
  });
};

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await isNameTaken(userBody.name)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'username already taken');
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
  const user = await getAnonUserByDeviceId(deviceId);
  if(user) return user
  const payload = {
    deviceId,
    nickname: getRandomName(),
    color: getRandomColor(),
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

const updateAnonUserWithAvatar = async (deviceId, avatarUrl) => {
  return prisma.anonymousUsers.update({
    where: {
      deviceId,
    },
    data: {
      avatar: avatarUrl,
    },
  });
};

const getAnonUserByDeviceId = async (deviceId) => {
  return prisma.anonymousUsers.findUnique({
    where: {
      deviceId,
    },
  });
};

module.exports = {
  isPasswordMatch,
  createUser,
  getUsers,
  getUserById,
  getUserByEmail,
  getUserByName,
  updateUserById,
  deleteUserById,
  createAnonUser,
  getAnonUserByName,
  getAnonUserByDeviceId,
  updateAnonUserWithAvatar,
};
