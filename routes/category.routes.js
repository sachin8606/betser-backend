const express = require('express');
const { authenticate } = require('../middlewares/auth.middleware');
const { roleAuthentication } = require('../middlewares/role.middleware');
const {
  getCategoryById,
  addCategory,
  deleteCategory,
  updateCategory,
  getCategories,
  addSubcategory,
  removeSubcategory,
} = require('../controllers/category.controller');

const router = express.Router();

router.post('/', authenticate, roleAuthentication(["supportAdmin", "superAdmin"]), addCategory);
router.get('/', authenticate, getCategories);
router.get('/:id', authenticate, getCategoryById);
router.put('/:id', authenticate, roleAuthentication(["supportAdmin", "superAdmin"]), updateCategory);
router.delete('/:id', authenticate, roleAuthentication(["supportAdmin", "superAdmin"]), deleteCategory);
router.post('/add-subcategory', authenticate, roleAuthentication(["supportAdmin", "superAdmin"]), addSubcategory);
router.post('/remove-subcategory', authenticate, roleAuthentication(["supportAdmin", "superAdmin"]), removeSubcategory);

module.exports = router;
