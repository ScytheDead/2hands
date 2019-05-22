const express = require('express');
const router = express.Router();
const controllerCategory = require('../controllers/categories');
const controllerAdmin = require('../controllers/admin');

router.get('/', controllerCategory.categories_get_all_index);

router.get('/admin', controllerAdmin.show_page_admin);

router.get('/user/:param', controllerAdmin.get_user);
router.get('/admin/user', controllerAdmin.get_all_users);

router.get('/admin/category', controllerCategory.categories_get_all);
router.get('/category/:categoryId', controllerCategory.get_category);


module.exports = router;