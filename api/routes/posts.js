const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const PostsController = require('../controllers/posts');


module.exports = router;