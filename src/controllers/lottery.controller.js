const catchAsync = require('../utils/catchAsync');
const lotteryService = require('../services/lottery.service');
const pick = require('../utils/pick');

const socketio = require('../common/socketio');

const orderLottery = catchAsync(async (req, res) => {
  const io = socketio.getIO();

  io.to('1').emit('msg-order', 'Ok');
  const order = await lotteryService.updateOrderLottery(req.body, req.user);
  const result = {
    message: 'Đơn hàng thành công',
    results: order,
  };
  res.send(result);
});

const getOrderLotteryHistory = catchAsync(async (req, res) => {
  const filter = pick(req.query, []);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const { name } = req.query;
  const orders = await lotteryService.findHistoryOrderLottery(filter, options, req.user, name);
  const result = {
    message: 'Lấy lịch sử đơn hàng thành công',
    ...orders,
  };
  res.send(result);
});

const getOrderLottery = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const orders = await lotteryService.findOrderLottery(filter, options);
  const result = {
    message: 'Lấy đơn hàng thành công',
    ...orders,
  };
  res.send(result);
});

const getUserBalance = catchAsync(async (req, res) => {
  const balance = await lotteryService.getBalance(req.user);
  res.send(balance);
});

module.exports = {
  orderLottery,
  getOrderLotteryHistory,
  getOrderLottery,
  getUserBalance,
};
