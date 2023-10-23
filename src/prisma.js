const { PrismaClient } = require('@prisma/client');
const paginate = require('./utils/paginate');
const config = require('./config/config');

const prisma = new PrismaClient({
  datasourceUrl: `postgres://${config.database.username}:${config.database.password}@${config.database.host}:${config.database.port}/${config.database.name}`,
}).$extends({
  query: {
    $allModels: {
      async findMany({ args, query }) {
        const { filter, options, ...others } = args;
        const { skip, limit, page, sort } = paginate(options);
        const results = await query({
          skip,
          take: limit,
          where: filter !== null || undefined ? filter : {},
          orderBy: sort,
          ...others,
        });
        const totalResults = results.length;
        const totalPages = Math.ceil(totalResults / limit);
        const result = {
          results,
          page,
          limit,
          totalPages,
          totalResults,
        };
        return result;
      },
    },
  },
});

module.exports = prisma;
