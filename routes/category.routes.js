const express = require('express');
const { authenticate } = require('../middlewares/auth.middleware');
const { roleAuthentication } = require('../middlewares/role.middleware');
const {
  getCategories,
  addCategory,
  deleteCategory,
  updateCategory,
} = require('../controllers/category.controller');

const router = express.Router();

router.post('/', authenticate, roleAuthentication(["supportAdmin", "superAdmin"]), addCategory);
router.get('/', authenticate, getCategories);
router.put('/:id', authenticate, roleAuthentication(["supportAdmin", "superAdmin"]), updateCategory);
router.delete('/:id', authenticate, roleAuthentication(["supportAdmin", "superAdmin"]), deleteCategory);

module.exports = router;
