const Joi = require('joi');

const getHistory = {
  query: Joi.object().keys({
    userId: Joi.string().guid({ version: 'uuidv4' }),
    name: Joi.string(),
  }),
};

module.exports = {
  getHistory,
};
