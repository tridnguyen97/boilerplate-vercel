const express = require('express');
const auth = require('../../middlewares/auth');
const lotteryValidation = require('../../validations/lottery.validation');
const lotteryController = require('../../controllers/lottery.controller');
const validate = require('../../middlewares/validate');

const router = express.Router();

router
  .route('/order')
  .post(auth('updateOrders'), lotteryController.orderLottery)
  .get(auth('getOrders'), lotteryController.getOrderLottery);

router
  .route('/history')
  .get(auth('getHistoryOrders'), validate(lotteryValidation.getHistory), lotteryController.getOrderLotteryHistory);

router.route('/user/balance').get(auth('getUserBalance'), lotteryController.getUserBalance);


module.exports = router;
