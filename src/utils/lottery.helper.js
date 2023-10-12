const randomCloseLottery = async () => {
  const min = 0;
  const max = 10;
  return Math.floor(Math.random() * max + min);
};

const getLocalUTCTime = (time) => {
  return time;
};

module.exports = {
  randomCloseLottery,
  getLocalUTCTime,
};
