const {
  createCategory,
  getAllCategories,
  findCategoryById,
  updateCategoryById,
  deleteCategoryById,
  addSubcategory,
  removeSubcategory,
} = require('../db/queries/category.queries');

// Create a new category
exports.addCategory = async (req, res) => {
  const { name } = req.body; // Removed subCategories

  if (!name) {
    return res.status(400).json({ message: 'Category name is required' });
  }

  try {
    const newCategory = await createCategory({ name });
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: 'Error creating category', error: error.message });
  }
};

// Get all categories with subcategories
exports.getCategories = async (req, res) => {
  try {
    const categories = await getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
};

// Get a category by ID
exports.getCategoryById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'Category ID is required' });
  }

  try {
    const category = await findCategoryById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching category', error: error.message });
  }
};

// Update category name by ID
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!id || !name) {
    return res.status(400).json({ message: 'Category ID and name are required' });
  }

  try {
    const updatedCategory = await updateCategoryById(id, name);
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: 'Error updating category', error: error.message });
  }
};

// Delete category by ID
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'Category ID is required' });
  }

  try {
    await deleteCategoryById(id);
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category', error: error.message });
  }
};

// Add a subcategory to a category
exports.addSubcategory = async (req, res) => {
  const { categoryId, name, description } = req.body;

  if (!categoryId || !name) {
    return res.status(400).json({ message: 'Category ID and subcategory name are required' });
  }

  try {
    const newSubcategory = await addSubcategory(categoryId, { name, description });
    res.status(201).json(newSubcategory);
  } catch (error) {
    res.status(500).json({ message: 'Error adding subcategory', error: error.message });
  }
};

// Remove a subcategory by ID
exports.removeSubcategory = async (req, res) => {
  const { subcategoryId } = req.params; // Changed from req.body to req.params

  if (!subcategoryId) {
    return res.status(400).json({ message: 'Subcategory ID is required' });
  }

  try {
    await removeSubcategory(subcategoryId);
    res.status(200).json({ message: 'Subcategory removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing subcategory', error: error.message });
  }
};
