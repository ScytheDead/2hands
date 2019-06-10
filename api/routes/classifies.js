const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const ClassifyController = require('../controllers/classifies');

// const storage = multer.diskStorage({
//     destination: function(req, file, cb){
//         cb(null, './uploads/classifies');
//     },
//     filename: function(req, file, cb){
//         cb(null, Date.now() + file.originalname);
//     }
// });

// const fileFilter = (req, file, cb) => {
//     //reject a file
//     if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')
//         cb(null, true);        
//     else
//         cb(new Error('Error: Wrong file format'), false);
// }
// const upload = multer({storage: storage, 
//     limits: {
//         fileSize: 1024 * 1024 * 1
//     },
//     fileFilter: fileFilter
// });


router.get('/', ClassifyController.classifies_get_all);

router.get('/category/:categoryId', ClassifyController.classifies_get_classify_by_category);

router.post('/', checkAuth, ClassifyController.classifies_create_classify);

router.patch('/image/:classifyId', checkAuth, ClassifyController.classifies_update_image);

router.get('/:classifyId', ClassifyController.classifies_get_classify);

router.patch('/:classifyId', checkAuth, ClassifyController.classifies_update_classify);

router.delete('/:classifyId', checkAuth, ClassifyController.classifies_delete_classify);

module.exports = router;