const express = require('express');

const router = express.Router();
const { stringeeController } = require('../../controllers');

router.route('/access_token').post(stringeeController.getAccessToken);

module.exports = router;
