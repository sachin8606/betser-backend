const { Op } = require('sequelize');
const Category = require('../../models/category.model'); // Assuming Category model is defined using Sequelize

// Create Category
exports.createCategory = async (categoryData) => {
  return await Category.create(categoryData);
};

// Get All Categories with optional filter
exports.getAllCategories = async (filter) => {
  return await Category.findAll({
    where: filter, // Apply filter if provided
  });
};

// Find Category by ID
exports.findCategoryById = async (id) => {
  return await Category.findByPk(id);
};

// Update Category by ID
exports.updateCategoryById = async (id, updatedName) => {
  const category = await Category.findByPk(id);
  if (!category) {
    throw new Error('Category not found');
  }
  
  category.name = updatedName;  // Update category name
  await category.save();
  return category;
};

// Delete Category by ID
exports.deleteCategoryById = async (id) => {
  const category = await Category.findByPk(id);
  if (!category) {
    throw new Error('Category not found');
  }
  
  await category.destroy();  // Delete the category
  return category;
};

// Add Option to Category (assuming `options` is an array column in the Category model)
exports.addOptionToCategory = async (categoryId, option) => {
  const category = await Category.findByPk(categoryId);
  if (!category) {
    throw new Error('Category not found');
  }

  // Assuming 'options' is an array field, we can add the new option
  category.options.push(option);
  await category.save();
  return category;
};

// Remove Option from Category
exports.removeOptionFromCategory = async (categoryId, option) => {
  const category = await Category.findByPk(categoryId);
  if (!category) {
    throw new Error('Category not found');
  }

  // Remove the option from the array
  category.options = category.options.filter(opt => opt !== option);
  await category.save();
  return category;
};
