const fs = require('fs');
const prisma = require('../prisma');
const { getVideoFileLocation } = require('../utils/video.helper');

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

const getVideoByNoRange = async (videoId, cb) => {
  const dest = getVideoFileLocation(videoId);
  const video = fs.createReadStream(dest);
  video.on('finish', () => {
    video.close(cb);
  });
  return video;
};

const createVideo = async (videoBody) => {
  return prisma.videos.create({
    data: videoBody,
  });
};

const getVideoById = async (videoId) => {
  return prisma.videos.findUnique({
    where: {
      id: videoId,
    },
  });
};

module.exports = {
  getVideoStream,
  getVideo,
  getAllVideos,
  getVideoByNoRange,
  createVideo,
  getVideoById,
};
