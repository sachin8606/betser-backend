const {
  createCategory,
  findCategory,
  updateCategoryById,
  deleteCategoryById,
} = require('../db/queries/category.queries');

// Create a new category
exports.addCategory = async (req, res) => {
  const { name,description,tag } = req.body; // Removed subCategories

  if (!name || !description || !tag) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newCategory = await createCategory(req.body);
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: 'Error creating category', error: error.message });
  }
};

// Get all categories with subcategories
exports.getCategories = async (req, res) => {
  try {
    const categories = await findCategory(req.body);
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'Category ID is required' });
  }

  try {
    const updatedCategory = await updateCategoryById(id, req.body);
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

