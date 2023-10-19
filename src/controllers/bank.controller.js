const httpStatus = require('http-status');
const { bankService } = require('../services');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');

const createBank = catchAsync(async (req, res) => {
  const bank = await bankService.createBank(req.body);
  res.status(httpStatus.CREATED).send(bank);
});

const findBankByUserId = catchAsync(async (req, res) => {
  const filter = pick(req.query, []);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const banks = await bankService.getBankByUserId(filter, options, req.query.userId);
  res.send(banks);
});

module.exports = {
  createBank,
  findBankByUserId,
};
