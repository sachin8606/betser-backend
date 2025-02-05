const { Op } = require('sequelize');
const { Category, Subcategory } = require('../../models/category.model');

// Create Category (without subcategories, as they should be added separately)
exports.createCategory = async (categoryData) => {
  return await Category.create(categoryData);
};

// Get All Categories with Subcategories
exports.getAllCategories = async () => {
  return await Category.findAll({
    include: [{ model: Subcategory, as: 'subcategories' }],
  });
};

// Find Category by ID with Subcategories
exports.findCategoryById = async (id) => {
  return await Category.findByPk(id, {
    include: [{ model: Subcategory, as: 'subcategories' }],
  });
};

// Update Category by ID
exports.updateCategoryById = async (id, updatedName) => {
  const category = await Category.findByPk(id);
  if (!category) {
    throw new Error('Category not found');
  }

  category.name = updatedName;
  await category.save();
  return category;
};

// Delete Category by ID (also deletes associated subcategories)
exports.deleteCategoryById = async (id) => {
  const category = await Category.findByPk(id);
  if (!category) {
    throw new Error('Category not found');
  }

  // Delete all associated subcategories first
  await Subcategory.destroy({ where: { categoryId: id } });

  await category.destroy();
  return category;
};

// Add Subcategory to Category
exports.addSubcategory = async (categoryId, subcategoryData) => {
  const category = await Category.findByPk(categoryId);
  if (!category) {
    throw new Error('Category not found');
  }

  return await Subcategory.create({ ...subcategoryData, categoryId });
};

// Remove Subcategory by ID
exports.removeSubcategory = async (subcategoryId) => {
  const subcategory = await Subcategory.findByPk(subcategoryId);
  if (!subcategory) {
    throw new Error('Subcategory not found');
  }

  await subcategory.destroy();
  return subcategory;
};
