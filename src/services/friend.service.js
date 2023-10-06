const httpStatus = require('http-status');
const prisma = require('../prisma');
const ApiError = require('../utils/ApiError');

const getFriendsList = async (userId) => {
  const user = await prisma.anonymousUsers.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      followedBy: {
        select: {
          followerId: true,
        },
      },
      following: {
        select: {
          followingId: true,
        },
      },
    },
  });
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  return user;
};

const createFriend = async (followingId, followerId) => {
  const follow = await prisma.anonymousUsers.findUnique({
    where: {
      id: followingId,
    },
  });
  if (!follow) throw new ApiError(httpStatus.NOT_FOUND, 'friend not found');
  const follower = await prisma.anonymousUsers.findUnique({
    where: {
      id: followerId,
    },
  });
  if (!follower) throw new ApiError(httpStatus.NOT_FOUND, 'user wants to make friend not found');
  return prisma.anonymousFriends.create({
    data: {
      followerId,
      followingId,
    },
  });
};

module.exports = {
  getFriendsList,
  createFriend,
};
