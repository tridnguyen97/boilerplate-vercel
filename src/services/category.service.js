const httpStatus = require('http-status');
const prisma = require('../prisma');
const ApiError = require('../utils/ApiError');

const getAllCategories = async (filter, options) => {
  return prisma.categories.findMany({
    filter,
    options,
  });
};

const getCategoryById = async (id) => {
  return prisma.categories.findUnique({
    where: {
      id,
    },
  });
};

const createCategory = async (categoryBody) => {
  return prisma.categories.create({
    data: categoryBody,
  });
};

const updateCategory = async (id, categoryBody) => {
  const category = await getCategoryById(id);
  if (!category) throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  return prisma.categories.update({
    where: { id },
    data: categoryBody,
  });
};

const deleteCategory = async (id) => {
  const category = await getCategoryById(id);
  if (!category) throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  return prisma.categories.delete({
    where: { id },
  });
};

module.exports = {
  getCategoryById,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
