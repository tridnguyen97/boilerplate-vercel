const logger = require('../config/logger');
const { randomCloseLottery } = require('../utils/lottery.helper');

const randomLottery = async (time, order) => {
  try {
    const chartLottery = await getTBChartLotteryOneLimitLast(time);
    if (chartLottery.closeNumber === null) number = randomCloseLottery();
  } catch (error) {
    logger.error(error);
  }
};
const getTBChartLotteryOneLimitLast = async (time) => {};

module.exports = {
  randomLottery,
  getTBChartLoteryOneLimitLast,
};
