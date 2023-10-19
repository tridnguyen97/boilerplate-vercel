const momentz = require('moment-timezone');
const config = require('../config/config');
const logger = require('../config/logger');

const randomCloseLottery = async () => {
  const min = 0;
  const max = 10;
  return Math.floor(Math.random() * max + min);
};

const getLocalTime = (utcTime) => {
  const localTime = momentz.utc(utcTime).second(0).tz(config.timezone).format('HH:mm:ss');
  return localTime;
};

const getLocalDateTime = (utcDate) => {
  return momentz.utc(utcDate).tz(config.timezone).format('DD/MM/yyyy HH:mm:ss Z');
};

const convertTime = (createdAt) => {
  const localCreatedAt = new Date(new Date(createdAt).getTime() + 25200000);
  const day = localCreatedAt.getDate();
  const month = localCreatedAt.getMonth() + 1;
  const year = localCreatedAt.getFullYear();
  const hours = localCreatedAt.getHours();
  const minutes = localCreatedAt.getMinutes();
  const seconds = localCreatedAt.getSeconds();
  return `${hours}:${minutes}:${seconds}`;
};

module.exports = {
  randomCloseLottery,
  getLocalTime,
  getLocalDateTime,
  convertTime,
};
