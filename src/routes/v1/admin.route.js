const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');

const router = express.Router();

router.route('/user').post(auth('createDirectors'), validate(userValidation.createDirector), userController.createAdminUser);

module.exports = router;
