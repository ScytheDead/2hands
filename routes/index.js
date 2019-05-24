const express = require('express');
const router = express.Router();
const controllerCategory = require('../controllers/categories');
const controllerAdmin = require('../controllers/admin');
const controllerClassify = require('../controllers/classify');

router.get('/', controllerCategory.categories_get_all_index);

// index admin
router.get('/admin', controllerAdmin.show_page_admin);

// user
router.get('/admin/user', controllerAdmin.get_all_users);
router.get('/user/:param', controllerAdmin.get_user);

// category
router.get('/admin/category', controllerCategory.categories_get_all);
router.get('/category/:categoryId', controllerCategory.get_category);
router.get('/category', controllerCategory.create_category);

//classify
router.get('/admin/classify', controllerClassify.classify_get_all);
router.get('/classify/:classifyId', controllerClassify.get_classify);
router.get('/classify', controllerClassify.create_classify);


module.exports = router;