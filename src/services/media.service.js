const config = require('../config/config');
const prisma = require('../prisma');

const createMedia = async (bodyMedia) => {
  const { image, name, userId } = bodyMedia;

  return prisma.chatMedia.create({
    data: {
      filePath: `${config.host_url}/v1/media/${image.originalname}`,
      fileName: name,
      userId,
    },
  });
};

module.exports = {
  createMedia,
};
