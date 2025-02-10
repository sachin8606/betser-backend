const { Op } = require('sequelize');
const Category = require('../../models/category.model');

exports.createCategory = async (categoryData) => {
  return await Category.create(categoryData);
};

exports.findCategory = async (filter = {}) => {
  return await Category.findAll({
    where: filter, 
  });
};

exports.updateCategoryById = async (id, updatedData) => {
  const category = await Category.findByPk(id);
  if (!category) {
    throw new Error('Category not found');
  }
  category = {...category,updatedData};
  await category.save();
  return category;
};

exports.deleteCategoryById = async (id) => {
  const category = await Category.findByPk(id);
  if (!category) {
    throw new Error('Category not found');
  }
  await category.destroy();
  return category;
};