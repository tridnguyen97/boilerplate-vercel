const path = require('path');
const config = require('../config/config');

const getAvatarAbsPath = (avatarName) => {
  return path.resolve(`media/chat/avatar/${avatarName}`);
};

const getAvatarUrl = (avatarName) => {
  return `${config.host_url}/v1/users/anon/avatar/${avatarName}`;
};

module.exports = {
  getAvatarAbsPath,
  getAvatarUrl,
};
