const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const PostController = require('../controllers/posts');


// get post by status
router.get('/accept', checkAuth, PostController.posts_get_post_accept);

router.get('/reject', checkAuth, PostController.posts_get_post_reject);

router.get('/waiting', checkAuth, PostController.posts_get_post_waiting);

//

router.get('/', PostController.posts_get_all);

router.post('/', checkAuth, PostController.posts_create_post);

router.get('/:postId', PostController.posts_get_post);

router.patch('/:postId', checkAuth, PostController.posts_update_post);

router.delete('/:postId', checkAuth, PostController.posts_delete_post);

//access post
router.patch('/accept/:postId', checkAuth, PostController.accept_post);

//reject post
router.patch('/reject/:postId', checkAuth, PostController.reject_post);

//hide post
router.patch('/hide/:postId', checkAuth, PostController.hide_post);

//show post
router.patch('/show/:postId', checkAuth, PostController.show_post);

//priority
router.patch('/priority/:postId', checkAuth, PostController.priority_post);


// Filter
//     // Filter by user
//         // Filter by user posting
router.get('/user/posting/:userId', checkAuth, PostController.posts_get_post_by_user_posting);
//         // Filter by user waiting
router.get('/user/waiting/:userId', checkAuth, PostController.posts_get_post_by_user_waiting);
//         // Filter by user reject
router.get('/user/reject/:userId', checkAuth, PostController.posts_get_post_by_user_reject);
//         // Filter by user hidden
router.get('/user/hide/:userId', checkAuth, PostController.posts_get_post_by_user_hide);
//         // Filter by user priority
router.get('/user/priority/:userId', checkAuth, PostController.posts_get_post_by_user_priority);

// Search

router.post('/search', PostController.search_post);

router.get('/accept/category/:categoryId', PostController.posts_get_post_accept_by_category);

router.get('/accept/classify/:classifyId', PostController.posts_get_post_accept_by_classify);

router.get('/accept/producer/:producerId', PostController.posts_get_post_accept_by_producer);


module.exports = router;