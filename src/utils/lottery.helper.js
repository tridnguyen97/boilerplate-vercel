const momentz = require('moment-timezone');
const config = require('../config/config');
const logger = require('../config/logger');

const randomCloseLottery = async () => {
  const min = 0;
  const max = 10;
  return Math.floor(Math.random() * max + min);
};

const getLocalTime = (utcTime) => {
  const localTime = momentz.utc(utcTime).tz(config.timezone).format('HH:mm:ss');
  return localTime;
};

const getLocalDateTime = (utcDate) => {
  return momentz.utc(utcDate).tz(config.timezone).format('DD/MM/yyyy HH:mm:ss')
}

const convertTime = (created_at) => {
  local_created_at = new Date(new Date(created_at).getTime() + 25200000)
  let day = local_created_at.getDate();
  let month = local_created_at.getMonth() + 1;
  let year = local_created_at.getFullYear();
  var hours = local_created_at.getHours();
  var minutes = local_created_at.getMinutes();
  var seconds = local_created_at.getSeconds();
  return `${hours}:${minutes}:${seconds}`
}

module.exports = {
  randomCloseLottery,
  getLocalTime,
  getLocalDateTime,
  convertTime,
};
