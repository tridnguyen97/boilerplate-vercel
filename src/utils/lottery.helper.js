const momentz = require('moment-timezone');
const config = require('../config/config');

const randomCloseLottery = async () => {
  const min = 0;
  const max = 10;
  return Math.floor(Math.random() * max + min);
};

const getLocalTime = (utcTime) => {
  const localTime = momentz.utc(utcTime).tz(config.timezone);
  return localTime;
};

module.exports = {
  randomCloseLottery,
  getLocalTime,
};
