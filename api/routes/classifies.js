const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const ClassifyController = require('../controllers/classifies');


router.get('/', ClassifyController.classifies_get_all);

router.post('/', checkAuth, ClassifyController.classifies_create_classify);

router.get('/:classifyId', checkAuth, ClassifyController.classifies_get_classify);

router.patch('/:classifyId', checkAuth, ClassifyController.classifies_update_classify);

router.delete('/:classifyId', checkAuth, ClassifyController.classifies_delete_classify);

module.exports = router;