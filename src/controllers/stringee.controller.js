const jwt = require('jsonwebtoken');
const { SuccessResponseObject, ErrorResponseObject } = require('../utils/http');

const config = require('../config/config');
const logger = require('../config/logger');

const { apiKeySid } = config.stringee;
const { apiKeySecret } = config.stringee;

module.exports = {
  getAccessToken: async (req, res, next) => {
    const { userId, expired } = req.body;
    const now = Math.floor(Date.now() / 1000);
    const exp = now + expired;

    const header = { cty: 'stringee-api;v=1' };
    const payload = {
      jti: `${apiKeySid}-${now}`,
      iss: apiKeySid,
      exp,
      userId,
    };
    try {
      const token = jwt.sign(payload, apiKeySecret, { algorithm: 'HS256', header, noTimestamp: true });
      const data = {
        access_token: token,
        userId,
        expired,
      };
      return res.json(new SuccessResponseObject('Succeeded', data));
    } catch (error) {
      logger.error(error);
      return res.json(new ErrorResponseObject('Failed', { error }));
    }
  },
};
