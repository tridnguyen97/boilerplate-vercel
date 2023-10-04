const moment = require('moment');

const getRandomName = (username) => {
  const currentDate = moment().toISOString();
  const encoded = Buffer.from(currentDate).toString('base64');
  return `${username}${encoded}`;
};

module.exports = {
  getRandomName,
};
