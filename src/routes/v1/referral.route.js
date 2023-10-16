const express = require('express');

const router = express.Router();
const referralController = require('../../controllers/referral.controller');

router.route('/invite/:code').get(referralController.getReferral);

module.exports = router;
