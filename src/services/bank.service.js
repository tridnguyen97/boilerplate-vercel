const prisma = require('../prisma');

const getBankByUserId = async (filter, options, userId) => {
  const bankFilter = {
    users: {
      some: {
        id: userId,
      },
    },
    ...filter,
  };
  const bank = await prisma.bank.findMany({
    filter: bankFilter,
    options,
  });
  return bank;
};

const createBank = async (bankBody) => {
  const { userId, ...bankData } = bankBody;
  const filter = {};
  const options = {
    sortBy: null,
    limit: null,
    page: null,
  };
  const banks = await getBankByUserId(filter, options, userId);
  if (banks.results.length >= 3) return banks;
  return prisma.bank.create({
    data: {
      ...bankData,
      users: {
        connect: { id: userId },
      },
    },
  });
};

module.exports = {
  createBank,
  getBankByUserId,
};
