const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');
const { getAvatarUrl, getAvatarAbsPath } = require('../utils/media.helper');

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
  const anonUser = await userService.createAnonUser(req.body);
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

const updateAvatar = catchAsync(async (req, res) => {
  const user = await userService.getAnonUserByDeviceId(req.body.deviceId);
  if (!req.files.avatar) throw new ApiError(httpStatus.NOT_FOUND, 'Avatar required');
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User chat not found');
  const avatarUrl = getAvatarUrl(req.files.avatar[0].filename);
  const updatedUser = await userService.updateAnonUserWithAvatar(user.deviceId, avatarUrl);
  res.send(updatedUser);
});

const getAvatar = catchAsync(async (req, res) => {
  res.sendFile(getAvatarAbsPath(req.params.avatarName));
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  createAnonUser,
  getAnonUser,
  getAvatar,
  updateAvatar,
};
