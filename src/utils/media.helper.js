const path = require('path');

const getMediaFile = (filename) => {
  return path.resolve(`media/images/chat/${filename}`);
};

const getMediaVideo = (videoName) => {
  return path.resolve(`media/videos/${videoName}`);
};

module.exports = {
  getMediaFile,
  getMediaVideo,
};
