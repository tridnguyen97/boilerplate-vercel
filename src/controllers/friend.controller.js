const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const friendService = require('../services/friend.service');

const getFriendsList = catchAsync(async (req, res) => {
  const friends = await friendService.getFriendsList(req.params.userId);
  res.send(friends);
});

const createFriendship = catchAsync(async (req, res) => {
  const friendship = await friendService.createFriend(req.body.friendId, req.body.userId);
  res.status(httpStatus.CREATED).send(friendship);
});

module.exports = {
  getFriendsList,
  createFriendship,
};
