const moment = require('moment');

const getRandomName = (user) => {
  const currentDate = moment().toISOString();
  const encoded = Buffer.from(currentDate).toString('base64');
  return `${user.name}${encoded}`;
};

module.exports = {
  getRandomName,
};
