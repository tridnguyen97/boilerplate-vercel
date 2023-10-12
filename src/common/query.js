const { Prisma } = require('@prisma/client');
const prisma = require('../prisma');
const logger = require('../config/logger');

async function updateRowToTable(table, set, where) {
  try {
    const query = `UPDATE ${table} SET ${set} WHERE ${where} ;`;
    const result = await prisma.$queryRaw(Prisma.raw(query));
    return result;
  } catch (error) {
    logger.error(`${table} ${set} ${error}`);
  }
}
async function getTBChartLoteryOneLimitLast(table, time, name) {
  const query = `SELECT * FROM ${table}  WHERE time=${time} AND name='${name}' ORDER BY id DESC LIMIT 1 `;
  const result = await prisma.$queryRaw(Prisma.raw(query));
  return result;
}
async function addRowToTable(table, obj) {
  try {
    const keys = Object.keys(obj);
    const values = keys.map((key) => obj[key]);
    const result = await prisma.$executeRaw`INSERT INTO ${Prisma.raw(`"${table}"`)} 
        (${Prisma.raw(keys.map((key) => `"${key}"`).join(','))})
        VALUES (${Prisma.join(values)})`;
    return result;
  } catch (error) {
    logger.error(error, 'addtbb');
  }
}
module.exports = {
  getRowToTable: async (table, where) => {
    try {
      const query = `SELECT * FROM ${table} ${where ? `WHERE ${where}` : ''}`;
      const result = await prisma.$queryRaw(Prisma.raw(query));
      return result;
    } catch (error) {
      logger.error(error);
    }
  },
  updateRowToTable,
  getTBChartLoteryOneLimitLast,
  addRowToTable,
};
