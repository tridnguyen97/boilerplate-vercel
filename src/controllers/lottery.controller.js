const catchAsync = require('../utils/catchAsync');
const lotteryService = require('../services/lottery.service');
const pick = require('../utils/pick');

const orderLottery = catchAsync(async (req, res) => {
  const order = await lotteryService.updateOrderLottery(req.body);
  const result = {
    message: 'Đơn hàng thành công',
    results: order,
  };
  res.send(result);
});

const getOrderLotteryHistory = catchAsync(async (req, res) => {
  const filter = pick(req.query, []);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const { userId, name } = req.query;
  const orders = await lotteryService.findHistoryOrderLottery(filter, options, userId, name);
  const result = {
    message: 'Lấy lịch sử đơn hàng thành công',
    ...orders,
  };
  res.send(result);
});

const getOrderLottery = catchAsync(async (req, res) => {
  const filter = pick(req.query, []);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const orders = await lotteryService.findOrderLottery(filter, options);
  const result = {
    message: 'Lấy đơn hàng thành công',
    ...orders,
  };
  res.send(result);
});

module.exports = {
  orderLottery,
  getOrderLotteryHistory,
  getOrderLottery,
};
