const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const ProducerController = require('../controllers/producers');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/producers');
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


router.get('/', ProducerController.producers_get_all);

router.get('/classify/:classifyId', ProducerController.producers_get_producer_by_classify);

router.post('/', checkAuth, upload.single('image'), ProducerController.producers_create_producer);

router.patch('/image/:producerId', checkAuth, upload.single('image'), ProducerController.producers_update_image);

router.get('/:producerId', checkAuth, ProducerController.producers_get_producer);

router.patch('/:producerId', checkAuth, ProducerController.producers_update_producer);

router.delete('/:producerId', checkAuth, ProducerController.producers_delete_producer);

module.exports = router;