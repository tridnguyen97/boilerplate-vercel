const { fakerVI } = require('@faker-js/faker');

const getRandomName = () => {
  return `${fakerVI.person.firstName()}`;
};

module.exports = {
  getRandomName,
};
