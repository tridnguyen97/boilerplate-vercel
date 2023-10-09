const randomCloseLottery = async () => {
  const min = 0;
  const max = 10;
  return Math.floor(Math.random() * max + min);
};

module.exports = {
  randomCloseLottery,
};
