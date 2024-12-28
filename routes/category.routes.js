const express = require('express');
const { authenticate } = require('../middlewares/auth.middleware');
const { roleAuthentication } = require('../middlewares/role.middleware');
const { getCategoryById, addCategory, deleteCategory, updateCategory, getCategories, addOption, removeOption } = require('../controllers/category.controller');
const router = express.Router();

router.post('/',authenticate,roleAuthentication(["supportAdmin","superAdmin"]), addCategory); 
router.get('/',authenticate, getCategories); 
router.get('/:id',authenticate, getCategoryById);
router.put('/:id',authenticate,roleAuthentication(["supportAdmin","superAdmin"]), updateCategory);
router.delete('/:id',authenticate,roleAuthentication(["supportAdmin","superAdmin"]), deleteCategory);
router.post('/add-option',authenticate,roleAuthentication(["supportAdmin","superAdmin"]), addOption);
router.post('/remove-option',authenticate,roleAuthentication(["supportAdmin","superAdmin"]), removeOption);
module.exports = router;