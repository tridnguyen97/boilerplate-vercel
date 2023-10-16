const path = require('path');
const config = require('../config/config');
const prisma = require('../prisma');
const logger = require('../config/logger');

const createMedia = async (bodyMedia) => {
  const { image, name, userId } = bodyMedia;
  const fileName = image[0].filename;
  logger.info(JSON.stringify(image));
  logger.info(image.filename);
  return prisma.chatMedia.create({
    data: {
      filePath: `${config.host_url}/v1/media/${encodeURIComponent(fileName)}`,
      fileName,
      userId,
      type: 'image',
    },
  });
};

const createVideoMedia = async (bodyVideo) => {
  const { video, name, userId } = bodyVideo;
  logger.info(JSON.stringify(video));
  logger.info(video[0].filename);
  const videoName = video[0].filename;
  return prisma.chatMedia.create({
    data: {
      filePath: `${config.host_url}/v1/media/video/${encodeURIComponent(videoName)}`,
      fileName: videoName,
      userId,
      type: 'video',
    },
  });
};

const createAudioMedia = async (bodyAudio) => {
  const { audio, name, userId } = bodyAudio;
  const audioName = audio[0].filename;
  return prisma.chatMedia.create({
    data: {
      filePath: `${config.host_url}/v1/media/audio/${encodeURIComponent(audioName)}`,
      fileName: audioName,
      userId,
      type: 'audio',
    },
  });
};

const getMediaFile = (filename) => {
  return path.resolve(`media/chat/images/${filename}`);
};

const getMediaVideo = (videoName) => {
  return path.resolve(`media/chat/videos/${videoName}`);
};

const getMediaAudio = (audioName) => {
  return path.resolve(`media/chat/audios/${audioName}`);
};

module.exports = {
  createMedia,
  createVideoMedia,
  createAudioMedia,
  getMediaFile,
  getMediaVideo,
  getMediaAudio,
};
