const httpStatus = require('http-status');
const prisma = require('../prisma');
const ApiError = require('../utils/ApiError');
const { userService } = require('.');
const { getRandomName } = require('../utils/contact.helper');

const getAllContacts = async (filter, options) => {
  const contacts = await prisma.contacts.findMany({
    filter,
    options,
  });
  return contacts;
};

const getContactList = async (filter, options) => {
  const contacts = await prisma.groups.findMany({
    filter,
    options,
  });
  return contacts;
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
