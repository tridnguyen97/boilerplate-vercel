const express = require('express');
const auth = require('../../middlewares/auth');

const lotteryController = require('../../controllers/lottery.controller');

const router = express.Router();

router
  .route('/order')
  .post(auth('updateOrders'), lotteryController.orderLottery)
  .get(auth('getOrders'), lotteryController.getOrderLottery);
router.route('/history').get(auth('getHistoryOrders'), lotteryController.getOrderLotteryHistory);

module.exports = router;
