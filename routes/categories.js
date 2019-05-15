const express = require('express');
const router = express.Router();

const CategoryController = require('../controllers/categories');

router.get('/', CategoryController.categories_get_all);

module.exports = router;