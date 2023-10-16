const path = require('path');
const config = require('../config/config');

const getMediaFile = (filename) => {
  return path.resolve(`media/images/${filename}`);
};

const getMediaVideo = (videoName) => {
    return path.resolve(`media/videos/${videoName}`);
}

const getMediaAudio = (audioName) => {
  return path.resolve(`media/audios/${audioName}`)
}

const getAvatarAbsPath = (avatarName) => {
  return path.resolve(`media/chat/avatars/${avatarName}`);
};

const getAvatarUrl = (avatarName) => {
  return `${config.host_url}/v1/users/anon/avatar/${avatarName}`;
};

module.exports = {
  getMediaFile,
  getMediaVideo,
  getAvatarAbsPath,
  getAvatarUrl,
};
