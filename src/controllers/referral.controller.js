const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { referralService } = require('../services');
const ApiError = require('../utils/ApiError');

const createReferral = catchAsync(async (req, res) => {
  await referralService.createReferral(req.user);
  res.status(httpStatus.CREATED).send();
});

const getReferral = catchAsync(async (req, res) => {
  const referral = await referralService.findReferralByCode(req.params.code);
  if (!referral) throw new ApiError(httpStatus.NOT_FOUND, 'referrer not found');
  res.send({
    status: 'Thành công',
    message: 'Referral code hợp lệ',
  });
});

module.exports = {
  createReferral,
  getReferral,
};
