const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const CategoryController = require('../controllers/categories');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/categories');
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    //reject a file
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')
        cb(null, true);        
    else
        cb(new Error('Error: Wrong file format'), false);
}
const upload = multer({storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 1
    },
    fileFilter: fileFilter
});

router.get('/', CategoryController.categories_get_all);

router.post('/', checkAuth, upload.single('image'), CategoryController.categories_create_category);

router.patch('/image/:categoryId', checkAuth, upload.single('image'), CategoryController.categories_update_image);

router.get('/:categoryId', checkAuth, CategoryController.categories_get_category);

router.patch('/:categoryId', checkAuth, CategoryController.categories_update_category);

router.delete('/:categoryId', checkAuth, CategoryController.categories_delete_category);

module.exports = router;