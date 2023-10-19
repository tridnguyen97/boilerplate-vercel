const prisma = require('../prisma');
const { generateCode } = require('../utils/referral.helper');

const createReferral = async (referrer) => {
  const code = generateCode();
  return prisma.referral.create({
    data: {
      code: code[0],
      userId: referrer.id,
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
