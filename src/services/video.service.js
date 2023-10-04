const fs = require('fs');
const prisma = require('../prisma');

const getVideoStream = async (fileId, start, end) => {
  const videoStream = fs.createReadStream(`media/videos/${fileId}`, { start, end });
  return videoStream;
};

const getAllVideos = async (filter, options) => {
  return prisma.videos.findMany({
    filter,
    options,
  });
};

const getVideo = async (videoId) => {
  return prisma.videos.findUnique({
    where: {
      fileId: videoId,
    },
  });
};

const createVideo = async (videoBody) => {
  return prisma.videos.create({
    data: videoBody,
  });
};

module.exports = {
  getVideoStream,
  getVideo,
  getAllVideos,
  createVideo,
};
