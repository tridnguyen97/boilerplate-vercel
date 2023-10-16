var jwt = require('jsonwebtoken');
const { SuccessResponseObject, ErrorResponseObject } = require('../utils/http');

const config = require('../config/config');
const logger = require('../config/logger');
const apiKeySid = config.stringee.apiKeySid;
const apiKeySecret = config.stringee.apiKeySecret;

module.exports = { 
    getAccessToken: async(req, res, next) => {
        var {userId, expired} = req.body
        var now = Math.floor(Date.now() / 1000);
        var exp = now + expired;

        var header = {cty: "stringee-api;v=1"};
        var payload = {
            jti: apiKeySid + "-" + now,
            iss: apiKeySid,
            exp: exp,
            userId: userId
        };
        try {
            var token = jwt.sign(payload, apiKeySecret, {algorithm: 'HS256', header: header, noTimestamp: true})
            var data = {
                "access_token": token,
                "userId": userId,
                "expired": expired
            }
            return res.json(new SuccessResponseObject("Succeeded", data))
        }
        catch(error) {
            logger.error(error)
            return res.json(new ErrorResponseObject("Failed", {error}))
        }
    }
}
