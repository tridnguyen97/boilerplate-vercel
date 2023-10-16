const httpStatus = require('http-status');
const _ = require('lodash');
const userService = require('./user.service');
const ApiError = require('../utils/ApiError');
const prisma = require('../prisma');
const { getLocalTime, getLocalDateTime } = require('../utils/lottery.helper');

const updateOrderLottery = async (orderData, user) => {
  const { balance, value, name, time } = orderData;
  let orderTalent = 0;
  let orderFaint = 0;
  let orderEven = 0;
  let orderOdd = 0;
  const mostRecentChart = await prisma.chartLottery.findFirst({
    orderBy: {
      createdAt: 'desc',
    },
  });
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy user');
  if (!user.balance || balance > user.balance) throw new ApiError(httpStatus.BAD_REQUEST, 'Số dư không đủ');
  const updateUser = await userService.updateUserById(user.id, {
    balance: user.balance - balance,
  });
  if (value === 'Thập') orderTalent = 1;
  if (value === 'Tứ') orderFaint = 1;
  if (value === 'Cô') orderEven = 1;
  if (value === 'Nương') orderOdd = 1;
  return prisma.orderLottery.create({
    data: {
      userid: user.id,
      sessionId: mostRecentChart.sessionId,
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

const findHistoryOrderLottery = async (queryFilter, options, user, name) => {
  if (!user) throw new ApiError(httpStatus.UNAUTHORIZED, 'Xin đăng nhập lại.');
  const filter = _.assign(queryFilter, {
    userid: user.id,
    name,
  });
  const [history, totalCount] = await prisma.$transaction([
    prisma.orderLottery.findMany({
      filter,
      options,
    }),
    prisma.orderLottery.count({
      where: filter,
    }),
  ]);
  const { results, page, limit } = history;
  const displayedHistory = results.map((item) => {
    let value = '';
    if (item.orderTalent) value = 'Thập';
    if (item.orderFaint) value = 'Tứ';
    if (item.orderEven) value = 'Cô';
    if (item.orderOdd) value = 'Nương';
    return {
      value,
      name: item.name,
      sessionId: item.sessionId,
      status: item.status,
      createdAt: getLocalDateTime(item.createdAt),
    };
  });

  return {
    results: displayedHistory,
    page,
    limit,
    totalPages: Math.ceil(totalCount / limit),
    totalCount,
  };
};

const findOrderLottery = async (queryFilter, options) => {
  const filter = _.assign(queryFilter, {
    AND: [
      {
        number: {
          not: null,
        },
      },
      {
        number2: {
          not: null,
        },
      },
      {
        number3: {
          not: null,
        },
      },
    ],
  });
  // phương án tạm thời do prisma không có findManyAndCount
  const [charts, totalCount] = await prisma.$transaction([
    prisma.chartLottery.findMany({
      filter,
      options,
    }),
    prisma.chartLottery.count({
      where: filter,
    }),
  ]);
  const { results, page, limit } = charts;

  const displayCharts = results.map((chart) => {
    const amountSet = parseInt(chart.number, 10) + parseInt(chart.number2, 10) + parseInt(chart.number3, 10);
    return {
      sessionId: chart.sessionId,
      number: `${chart.number},${chart.number2},${chart.number3}`,
      value1: amountSet > 10 ? 'Thập' : 'Tứ',
      value2: amountSet % 2 ? 'Cô' : 'Nương',
      createdAt: getLocalTime(chart.createdAt),
    };
  });
  return {
    results: displayCharts,
    page,
    limit,
    totalPages: Math.ceil(totalCount / limit),
    totalCount,
  };
};

const getBalance = async (user) => {
  return {
    balance: user.balance,
    currency: 'vnd',
  };
};

module.exports = {
  findOrderLottery,
  findHistoryOrderLottery,
  updateOrderLottery,
  getBalance,
};
