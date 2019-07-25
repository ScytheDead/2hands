const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const MessageController = require('../controllers/messages');

router.post('/', checkAuth, MessageController.create_Message);

router.get('/user/:userId', checkAuth, MessageController.get_all_messages_by_user);

router.get('/:messageId', checkAuth, MessageController.get_message_by_id);

module.exports = router;