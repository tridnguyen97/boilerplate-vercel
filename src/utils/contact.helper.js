const { fakerVI } = require('@faker-js/faker');

const getRandomName = () => {
  return `${fakerVI.person.firstName()}`;
};

const getRandomColor = () => {
  return fakerVI.color.rgb();
}

module.exports = {
  getRandomName,
  getRandomColor
};
