const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const PostController = require('../controllers/posts');

router.get('/', PostController.posts_get_all);

router.post('/', checkAuth, PostController.posts_create_post);

router.get('/:postId', PostController.posts_get_post);

router.patch('/:postId', checkAuth, PostController.posts_update_post);

router.delete('/:postId', checkAuth, PostController.posts_delete_post);

// Filter

router.get('/user/:userId', checkAuth, PostController.posts_get_post_by_user);

router.get('/category/:categoryId', PostController.posts_get_post_by_category);

router.get('/classify/:classifyId', PostController.posts_get_post_by_classify);

router.get('/producer/:producerId', PostController.posts_get_post_by_producer);

module.exports = router;