const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const UserController = require('../controllers/users');

router.get('/', checkAuth, UserController.users_get_all);

router.get('/subscribes/:userId', checkAuth, UserController.users_get_subscribes);

router.get('/:userId', checkAuth, UserController.users_get_user);

router.post('/signup', UserController.user_signup);

router.post('/login', UserController.user_login);

router.patch('/avatar/:userId', checkAuth, UserController.user_update_avatar);

router.patch('/subscribe/:userId', checkAuth, UserController.user_update_subscribe);

router.patch('/:userId', checkAuth, UserController.user_update);

router.delete('/:userId', checkAuth, UserController.user_delete);

module.exports = router;