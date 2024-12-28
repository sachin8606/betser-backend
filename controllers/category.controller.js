const { createCategory, getAllCategories, findCategoryById, updateCategoryById, deleteCategoryById, addOptionToCategory, removeOptionFromCategory } = require("../db/queries/category.queries");

exports.addCategory = async (req, res) => {
    const { name, options } = req.body;

    try {
        const newCategory = await createCategory({ name, options });
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ message: 'Error creating category', error: error.message });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const categories = await getAllCategories();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories', error: error.message });
    }
};

exports.getCategoryById = async (req, res) => {
    const { id } = req.params;

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

exports.updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const updatedCategory = await updateCategoryById(id, name);
        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: 'Error updating category', error: error.message });
    }
};

exports.deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedCategory = await deleteCategoryById(id);
        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting category', error: error.message });
    }
};

exports.addOption = async (req, res) => {
    const { categoryId, option } = req.body;

    try {
        const updatedCategory = await addOptionToCategory(categoryId, option);
        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ message: 'Option added successfully', category: updatedCategory });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.removeOption = async (req, res) => {
    const { categoryId, option } = req.body;
  
    try {
      const updatedCategory = await removeOptionFromCategory(categoryId, option);
      if (!updatedCategory) {
        return res.status(404).json({ message: 'Category not found or option does not exist' });
      }
      res.status(200).json({ message: 'Option removed successfully', category: updatedCategory });
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  };