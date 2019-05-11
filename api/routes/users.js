const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const multer = require('multer');
const UserController = require('../controllers/users');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/users');
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
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

router.post('/signup', UserController.user_signup);

router.post('/login', UserController.user_login);

router.patch('/:userId', checkAuth, UserController.user_update);

router.patch('/avatar/:userId', checkAuth, upload.single('avatar'), UserController.user_update_avatar);

router.delete('/:userId', checkAuth, UserController.user_delete);

module.exports = router;