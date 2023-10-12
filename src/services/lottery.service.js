const httpStatus = require('http-status');
const _ = require('lodash');
const userService = require('./user.service');
const ApiError = require('../utils/ApiError');
const prisma = require('../prisma');
const { getLocalUTCTime } = require('../utils/lottery.helper');

const updateOrderLottery = async (orderData) => {
  const { userId, balance, value, name, time } = orderData;
  let orderTalent = 0;
  let orderFaint = 0;
  let orderEven = 0;
  let orderOdd = 0;
  const user = await userService.getUserById(userId);
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy user');
  if (balance > user.balance) throw new ApiError(httpStatus.BAD_REQUEST, 'Số dư không đủ');
  const updateUser = await userService.updateUserById(userId, {
    balance: user.balance - balance,
  });
  if (value === 'Thập') orderTalent = 1;
  if (value === 'Tứ') orderFaint = 1;
  if (value === 'Cô') orderEven = 1;
  if (value === 'Nương') orderOdd = 1;
  return prisma.orderLottery.create({
    data: {
      userid: userId,
      balance,
      userName: updateUser.name,
      orderTalent,
      orderEven,
      orderOdd,
      orderFaint,
      name,
      time,
    },
    select: {
      name: true,
      time: true,
    },
  });
};

const findHistoryOrderLottery = async (queryFilter, options, userId, name) => {
  const filter = _.assign(queryFilter, {
    userid: userId,
    name,
  });
  return prisma.orderLottery.findMany({
    filter,
    options,
  });
};

const findOrderLottery = async (queryFilter, options) => {
  const filter = _.assign(queryFilter, {
    filters: {
      some: {
        OR: [
          {
            number: null,
          },
          {
            number2: null,
          },
          {
            number3: null,
          },
        ],
      },
    },
  });
  const charts = await prisma.chartLottery.findMany({
    filter,
    options,
  });
  const { results, ...pagination } = charts;

  const displayCharts = results.map((chart) => {
    const amountSet = parseInt(chart.number, 10) + parseInt(chart.number2, 10) + parseInt(chart.number3, 10);
    return {
      sessionId: chart.sessionId,
      number: `${chart.number},${chart.number2},${chart.number3}`,
      value1: amountSet > 10 ? 'Thập' : 'Tứ',
      value2: amountSet % 2 ? 'Cô' : 'Nương',
      createdAt: getLocalUTCTime(chart.createdAt),
    };
  });
  return {
    displayCharts,
    ...pagination,
  };
};

module.exports = {
  findOrderLottery,
  findHistoryOrderLottery,
  updateOrderLottery,
};
