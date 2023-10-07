const config = require('../config/config');
const prisma = require('../prisma');

const createMedia = async (bodyMedia) => {
  const { name, userId } = bodyMedia;

  return prisma.chatMedia.create({
    data: {
      filePath: `${config.host_url}/v1/media/${encodeURIComponent(name)}`,
      fileName: name,
      userId,
      type: 'image',
    },
  });
};

const createVideoMedia = async (bodyVideo) => {
  const { name, userId } = bodyVideo;
  return prisma.chatMedia.create({
    data: {
      filePath: `${config.host_url}/v1/media/video/${encodeURIComponent(name)}`,
      fileName: name,
      userId,
      type: 'video',
    },
  });
};

module.exports = {
  createMedia,
  createVideoMedia,
};
