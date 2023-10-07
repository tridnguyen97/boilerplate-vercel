const path = require('path');

const getMediaFile = (filename) => {
  return path.resolve(`media/images/chat/${filename}`);
};

module.exports = {
  getMediaFile,
};
