// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const checkAuth = require('../middleware/check-auth');
// const PostController = require('../controllers/posts');

// const storage = multer.diskStorage({
//     destination: function(req, file, cb){
//         cb(null, './uploads/');
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
//         fileSize: 1024 * 1024 * 5
//     },
//     fileFilter: fileFilter
// });

// router.get('/', PostController.posts_get_all);

// router.post('/', checkAuth, upload.single('images'), PostController.posts_create_post);

// router.get('/:postId', PostController.posts_get_post);

// router.patch('/:postId', checkAuth, PostController.posts_update_post);

// router.delete('/:postId', checkAuth, PostController.posts_delete_post);

// module.exports = router;