const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const bankValidation = require('../../validations/bank.validation');
const bankController = require('../../controllers/bank.controller');

const router = express.Router();

router
  .route('/')
  .post(validate(bankValidation.createBanks), bankController.createBank)
  .get(validate(bankValidation.getBanks), bankController.findBankByUserId);

module.exports = router;
