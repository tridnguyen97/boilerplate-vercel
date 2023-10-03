const httpStatus = require('http-status');
const prisma = require('../prisma');
const ApiError = require('../utils/ApiError');
const { userService } = require('.');
const { getRandomName } = require('../utils/contact.helper');

const getAllContacts = async (filter, options) => {
  let sort = '';
  const DEFAULT_SORT = {
    createdAt: 'desc',
  };
  if (options.sortBy) {
    const sortingCriteria = [];
    options.sortBy.split(',').forEach((sortOption) => {
      const [key, order] = sortOption.split(':');
      sortingCriteria.push(JSON.parse(`${key}: ${order}`));
    });
  } else {
    sort = DEFAULT_SORT;
  }
  const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10;
  const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
  const skip = (page - 1) * limit;
  let populate = {};
  if (options.populate) {
    options.populate.split(',').forEach((populateOption) => {
      populate = populateOption
        .split('.')
        .reverse()
        .reduce((a, b) => ({ path: b, populate: a }));
    });
  }
  const contacts = await prisma.contacts.findMany({
    skip,
    take: limit,
    where: filter,
    orderBy: sort,
  });
  const results = contacts;
  const totalResults = contacts.length;
  const totalPages = Math.ceil(totalResults / limit);
  const result = {
    results,
    page,
    limit,
    totalPages,
    totalResults,
  };
  return result;
};

const getContactList = async (filter, options) => {
  let sort = '';
  const DEFAULT_SORT = {
    createdAt: 'desc',
  };
  if (options.sortBy) {
    const sortingCriteria = [];
    options.sortBy.split(',').forEach((sortOption) => {
      const [key, order] = sortOption.split(':');
      sortingCriteria.push(JSON.parse(`${key}: ${order}`));
    });
  } else {
    sort = DEFAULT_SORT;
  }
  const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10;
  const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
  const skip = (page - 1) * limit;
  let populate = {};
  if (options.populate) {
    options.populate.split(',').forEach((populateOption) => {
      populate = populateOption
        .split('.')
        .reverse()
        .reduce((a, b) => ({ path: b, populate: a }));
    });
  }
  const contacts = await prisma.groups.findMany({
    skip,
    take: limit,
    where: filter,
    orderBy: sort,
  });
  const results = contacts;
  const totalResults = contacts.length;
  const totalPages = Math.ceil(totalResults / limit);
  const result = {
    results,
    page,
    limit,
    totalPages,
    totalResults,
  };
  return result;
};

const createContact = async (contactBody) => {
  const { userId } = contactBody;
  if (!userId) throw new ApiError(httpStatus.BAD_REQUEST, 'user ID not found');
  const user = await userService.getUserById(userId);
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'user not found');
  const nickname = getRandomName(user);
  return prisma.contacts.create({
    data: {
      nickname,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
};

const createContactGroup = async (body) => {
  return prisma.groups.create({
    data: body,
  });
};

module.exports = {
  getAllContacts,
  getContactList,
  createContact,
  createContactGroup,
};
