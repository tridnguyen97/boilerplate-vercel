const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');
const { getRandomName } = require('../utils/contact.helper');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.getUsers(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const createAnonUser = catchAsync(async (req, res) => {
  const { deviceId } = req.body;
  const payload = {
    deviceId,
    nickname: getRandomName(),
  };
  const anonUser = await userService.createAnonUser(payload);
  res.send(anonUser);
});

const getAnonUser = catchAsync(async (req, res) => {
  const filter = {
    nickname: {
      contains: req.params.name,
    },
  };
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const anonUser = await userService.getAnonUserByName(filter, options);
  if (!anonUser) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  res.send(anonUser);
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  createAnonUser,
  getAnonUser,
};
