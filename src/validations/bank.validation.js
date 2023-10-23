const Joi = require('joi');

const getBanks = {
  query: Joi.object().keys({
    userId: Joi.string().guid({ version: 'uuidv4' }),
  }),
};

const createBanks = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    code: Joi.string().required(),
    cardNum: Joi.string().required(),
    userId: Joi.string().guid({ version: 'uuidv4' }),
  }),
};

module.exports = {
  getBanks,
  createBanks,
};
