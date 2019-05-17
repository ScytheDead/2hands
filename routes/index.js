const express = require('express');
const router = express.Router();
const controllerCategory = require('../controllers/categories');

router.get('/', controllerCategory.categories_get_all_index);
// router.get('/', (req, res) => {
//     res.render('index', {layout: 'default', title: 'Express'});
// });

module.exports = router;