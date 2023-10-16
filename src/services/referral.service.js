const prisma = require('../prisma');
const { generateCode, getLink } = require('../utils/referral.helper');

const createReferral = async () => {
  const code = generateCode();
  const link = getLink(code);
  return prisma.referral.create({
    data: {
      code,
      link,
    },
  });
};

const findReferralByCode = async (code) => {
  return prisma.referral.findUnique({
    where: { code },
  });
};

module.exports = {
  createReferral,
  findReferralByCode,
};
