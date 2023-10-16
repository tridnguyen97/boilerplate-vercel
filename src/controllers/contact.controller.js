const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const { contactService } = require('../services');

const getAllContacts = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['userId']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const contacts = await contactService.getAllContacts(filter, options);
  res.send(contacts);
});

const createContact = catchAsync(async (req, res) => {
  const contact = await contactService.createContact(req.body);
  res.status(httpStatus.CREATED).send(contact);
});

const getContactGroups = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['userId']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const groups = await contactService.getContactGroups(filter, options);
  res.send(groups);
});

const createContactGroup = catchAsync(async (req, res) => {
  const group = await contactService.createContactGroup(req.body);
  res.status(httpStatus.CREATED).sent(group);
});

module.exports = {
  getAllContacts,
  getContactGroups,
  createContact,
  createContactGroup,
};
