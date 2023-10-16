const referralGen = require('referral-codes');
const config = require('../config/config');

const generateCode = () => {
  return referralGen.generate({
    count: 1,
    length: 8,
  });
};

const getLink = (code) => {
  return `${config.host_url}/v1/referral/invite/${code}`;
};

module.exports = {
  generateCode,
  getLink,
};
