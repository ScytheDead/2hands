const express = require('express');
const router = express.Router();

// ------------------------------ Admin -------------------------------
const controllerAdmin = require('../controllers/admin/admin');
const controllerCategoryAdmin = require('../controllers/admin/categories');
const controllerClassifyAdmin = require('../controllers/admin/classify');
const controllerProducerAdmin = require('../controllers/admin/producer');
const controllerPostAdmin = require('../controllers/admin/post');

// --------------------------------------------------------------------

// index admin
router.get('/admin', controllerAdmin.show_page_admin);

// user admin
router.get('/admin/user', controllerAdmin.get_all_users);
router.get('/user/:param', controllerAdmin.get_user);

// category admin
router.get('/admin/category', controllerCategoryAdmin.categories_get_all);
router.get('/category/:categoryId', controllerCategoryAdmin.get_category);
router.get('/category', controllerCategoryAdmin.create_category);

// classify admin
router.get('/admin/classify', controllerClassifyAdmin.classify_get_all);
router.get('/classify/:classifyId', controllerClassifyAdmin.get_classify);
router.get('/classify', controllerClassifyAdmin.create_classify);

// producer admin
router.get('/admin/producer', controllerProducerAdmin.producer_get_all);
router.get('/producer/:producerId', controllerProducerAdmin.get_producer);
router.get('/producer', controllerProducerAdmin.create_producer);

// post admin
router.get('/admin/post-waiting', controllerPostAdmin.post_waiting);
router.get('/admin/post-reject', controllerPostAdmin.post_reject);
router.get('/admin/post-accept', controllerPostAdmin.post_accept);
router.get('/admin/post-detail/:postId', controllerPostAdmin.get_detail_post);

// ------------------------------ User -------------------------------
const controllerIndex = require('../controllers/index');
const controllerPost = require('../controllers/posts');
const controllerLogin = require('../controllers/login');
const controllerMessage = require('../controllers/message');
const controllerUser = require('../controllers/user');
// --------------------------------------------------------------------

// index
router.get('/', controllerIndex.index);

// login
router.get('/login', controllerLogin.login);
router.get('/signup', controllerLogin.signup);

// user
router.get('/user', controllerUser.detail_user);

// chat
router.get('/message', controllerMessage.message);
router.get('/message/:messageId', controllerMessage.get_message);

// post
router.get('/dang-tin', controllerPost.create_post);
router.get('/post-detail/:postId', controllerPost.post_detail);
router.get('/post-edit/:postId', controllerPost.post_edit);
router.get('/posts', controllerPost.show_manage_posts);
router.get('/subscribes', controllerPost.show_subscribes_posts);
router.get('/:categoryId', controllerPost.view_posts_by_category);



module.exports = router;