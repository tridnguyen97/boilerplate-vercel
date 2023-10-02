const Joi = require('joi');

const createVideo = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    thumbnail: Joi.string(),
    title: Joi.string().required(),
    description: Joi.string(),
  }),
};

module.exports = {
  createVideo,
};
