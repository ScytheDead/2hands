const Producer = require('../models/producers');
const Classify = require('../models/classifies');
const Category = require('../models/categories');
const Post = require('../models/posts');
const User = require('../models/users');
const City = require('../models/cities');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const config = require('../../config');
const moment = require('moment');
moment.locale('vi');


exports.posts_get_all = (req, res) => {
    Post.find()
        .select('_id user producer classify category title content price address city images seller priority status note created_at updated_at')
        .populate('user', 'phoneNumber name address avatar')
        .populate('producer', 'title')
        .populate('classify', 'title')
        .populate('category', 'title')
        .populate('city', 'name location type')
        .exec()
        .then(posts => {
            const response = {
                count: posts.length,
                posts: posts.map(doc => {
                    return returnValueGet(doc);
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}

exports.posts_create_post = (req, res) => {
    var flagCreate = 1;
    const token = req.headers.authorization.split(" ")[1];
    const user = jwt.verify(token, config.JWT_KEY);
    User.findById(user.id) //check User available
        .then(user => {
            Category.findById(req.body.category) //check Category available
                .then(async category => {
                    if (req.body.classify != undefined) {
                        Classify.findById(req.body.classify) //check Classify available
                            .then(async classify => {
                                if (classify.category._id.toString() === category._id.toString()) {
                                    
                                    if (req.body.producer != undefined && req.body.producer != ``) {
                                        Producer.findById(req.body.producer) //check Producer available
                                            .then(async producer => {
                                                if (producer.category._id.toString() === category._id.toString()) {
                                                    if (producer.classify.toString() === classify._id.toString()) {
                                                        
                                                    } else {
                                                        flagCreate = 0;
                                                        res.status(500).json({
                                                            message: 'Producer not of classify'
                                                        });
                                                    }
                                                } else {
                                                    flagCreate = 0;
                                                    res.status(500).json({
                                                        message: 'Producer not of category'
                                                    });
                                                }
                                            })
                                            .catch(err => {
                                                flagCreate = 0;
                                                res.status(500).json({
                                                    message: 'Producer not found',
                                                    error: err
                                                });
                                            });
                                    }
                                } else {
                                    flagCreate = 0;
                                    res.status(500).json({
                                        message: 'classify not of category'
                                    });
                                }
                            })
                            .catch(err => {
                                flagCreate = 0;

                                res.status(500).json({
                                    message: 'Classify not found',
                                    error: err
                                });
                            });
                    }
                    if (flagCreate) {
                        City.findById(req.body.city)
                            .then(async city => {
                                var arrayImage = [];
                                if (req.body.images !== undefined && req.body.images !== null) {
                                    if (req.body.images.length >= 1 && req.body.images.length <= 6) {
                                        const pathImage = 'uploads/posts/';
                                        await saveArrayImage(pathImage, req.body.images)
                                            .then(arrayNameImage => {
                                                arrayImage = arrayNameImage;
                                                arrayImage.forEach((image, index) => {
                                                    arrayImage[index] = pathImage + image;
                                                })
                                            })
                                            .catch(err => {
                                                flagCreate = 0;
                                                res.status(422).json({
                                                    error: err
                                                });
                                            })

                                        if (flagCreate) {
                                            // user category classify producer title content price images seller note
                                            Post.find({
                                                    title: req.body.title
                                                })
                                                .then(posts => {
                                                    if (posts.length > 0) {
                                                        flagCreate = 0;
                                                        res.status(500).json({
                                                            message: 'The title already exists'
                                                        });
                                                    } else {
                                                        const post = new Post({
                                                            _id: new mongoose.Types.ObjectId(),
                                                            user: user.id,
                                                            category: req.body.category,
                                                            classify: req.body.classify,
                                                            producer: req.body.producer,
                                                            title: req.body.title,
                                                            content: req.body.content,
                                                            city: req.body.city,
                                                            price: req.body.price,
                                                            address: req.body.address,
                                                            images: arrayImage,
                                                            seller: req.body.seller,
                                                            note: req.body.note
                                                        });
                                                        post.save()
                                                            .then(result => {
                                                                res.status(201).json({
                                                                    message: 'Created post successful',
                                                                    createdPost: {
                                                                        id: result._id,
                                                                        user: {
                                                                            _id: result.user,
                                                                            name: user.name,
                                                                            phoneNumber: user.phoneNumber,
                                                                            address: user.address,
                                                                            isAdmin: user.isAdmin,
                                                                            isEmployee: user.isEmployee,
                                                                            isUser: user.isUser
                                                                        },
                                                                        category: {
                                                                            _id: result.category,
                                                                            title: category.title
                                                                        },
                                                                        classify: result.classify,
                                                                        producer: result.producer,
                                                                        title: result.title,
                                                                        content: result.content,
                                                                        price: result.price,
                                                                        address: result.address,
                                                                        city: {
                                                                            _id: result.city,
                                                                            name: city.name,
                                                                            location: city.location,
                                                                            type: city.type
                                                                        },
                                                                        images: result.images,
                                                                        seller: result.seller,
                                                                        priority: result.priority,
                                                                        status: result.status,
                                                                        note: result.note,
                                                                        createdAt: result.created_at,
                                                                        updatedAt: result.updated_at,
                                                                        request: {
                                                                            type: 'GET',
                                                                            createdPostURL: `${config.API_ADDRESS}/api/posts/` + result._id
                                                                        },
                                                                        moment: moment(result.updated_at, 'YYYYMMDD').fromNow()
                                                                    }
                                                                });
                                                            })
                                                            .catch(err => {
                                                                console.log(err);
                                                                if (req.body.images !== undefined && req.body.images !== null) {
                                                                    arrayImage.forEach(pathImage => deleteImage(pathImage));
                                                                }

                                                                if (err.name == "MongoError") {
                                                                    res.status(500).json({
                                                                        message: 'The title already exists',
                                                                        error: err
                                                                    });
                                                                } else {
                                                                    res.status(500).json({
                                                                        error: err
                                                                    });
                                                                }
                                                            });
                                                    }
                                                })
                                        }
                                    } else {
                                        res.status(500).json({
                                            message: 'pictures too much or too little',
                                            error: "pictures must >= 1 and <= 6"
                                        });
                                    }
                                } else {
                                    res.status(404).json({
                                        message: 'Not found images'
                                    });
                                }

                            })
                            .catch(err => {
                                res.status(500).json({
                                    message: 'City not found',
                                    error: err
                                });
                            });
                    }
                })
                .catch(err => {
                    res.status(500).json({
                        message: 'Category not found',
                        error: err
                    });
                });
        })
        .catch(err => {
            res.status(500).json({
                message: 'User not found',
                error: err
            });
        });
}

exports.posts_get_post = (req, res) => {
    const id = req.params.postId;
    Post.findById(id)
        .select('_id user producer classify category title content price city address images seller priority status note created_at updated_at')
        .populate('user', 'phoneNumber name address avatar')
        .populate('producer', 'title')
        .populate('classify', 'title')
        .populate('category', 'title')
        .populate('city', 'name location type')
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    post: returnValueGet(doc),
                    request: {
                        type: 'GET',
                        AllPostsURL: `${config.API_ADDRESS}/api/posts/`
                    }
                });
            }
        })
        .catch(err => {
            res.status(404).json({
                message: 'No valid entry found for provided ID',
                error: err
            });
        })
}

exports.posts_update_post = async (req, res) => {
    const id = req.params.postId;
    const updateOps = {};
    var flagUpdate = 1;
    var arrayImage = [];

    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    if (updateOps.classify !== undefined) {
        await delete updateOps.classify;
    }

    if (updateOps.category !== undefined) {
        await delete updateOps.category;
    }

    if (updateOps.priority !== undefined || updateOps.status !== undefined) {
        if (!await checkPermission(req.headers.authorization.split(" ")[1])) {
            return res.status(401).json({
                message: 'You don\'t have permission'
            });
        }
    }

    if (updateOps.images !== undefined && updateOps.images !== null) {
        if (updateOps.images.length >= 1 && updateOps.images.length <= 6) {
            const pathImage = 'uploads/posts/';
            await saveArrayImage(pathImage, updateOps.images)
                .then(arrayNameImage => {
                    arrayNameImage.forEach(image => {
                        arrayImage.push(pathImage + image);
                    });

                    Post.findById(id)
                        .select('images')
                        .exec()
                        .then(async result => {
                            if (result.images !== undefined && result.images !== null) {
                                await deleteArrayImage(result.images);
                            }
                        })
                        .catch(async err => {
                            await deleteArrayImage(updateOps.images);
                        });
                })
                .catch(async err => {
                    flagUpdate = 0;
                    if (err == 'Wrong file format') {
                        // delete images not in DB
                        var listImageNameDifferent = [];
                        var listImagesInDB = await getAllImagesNameInDB();
                        fs.readdir('uploads/posts/', async (err, filenames) => {
                            filenames.forEach(fileName => {
                                if (listImagesInDB.indexOf(pathImage + fileName) < 0)
                                    listImageNameDifferent.push(pathImage + fileName);
                            });
                            await deleteArrayImage(listImageNameDifferent);
                        });
                    }
                    res.status(422).json({
                        error: err
                    });
                });
        } else {
            flagUpdate = 0;
            res.status(500).json({
                message: 'pictures too much or too little',
                error: "pictures must >= 1 and <= 6"
            });
        }
    }

    if (flagUpdate) {
        if (arrayImage.length > 0) {
            updateOps.images = arrayImage;
        }

        Post.findById(id)
            .select('status')
            .exec()
            .then(async result => {
                if (result.status != 0) {
                    updateOps.status = 0;
                    Post.updateOne({
                            _id: id
                        }, {
                            $set: updateOps
                        })
                        .exec()
                        .then(result => {
                            res.status(200).json({
                                message: 'Post updated',
                                PostURL: `${config.API_ADDRESS}/api/posts/` + id
                            });
                        })
                        .catch(err => {
                            res.status(500).json({
                                message: 'No valid entry found for provided ID',
                                error: err
                            });
                        });
                } else {
                    res.status(500).json({
                        message: 'Post waiting for approval'
                    });
                }
            })
            .catch(async err => {
                res.status(500).json({
                    message: 'No valid entry found for provided ID',
                    error: err
                });
            });
    }
}

exports.posts_delete_post = (req, res) => {
    const id = req.params.postId;
    Post.findById(id)
        .select('images')
        .exec()
        .then(async result => {
            if (result.images !== undefined && result.images !== null) {
                await deleteArrayImage(result.images);
            }

            Post.deleteOne({
                    _id: id
                })
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: 'Post deleted'
                    });
                })
        })
        .catch(err => {
            res.status(500).json({
                message: 'No valid entry found for provided ID',
                error: err
            })
        });
}

exports.posts_get_post_by_user = (req, res) => {
    const userId = req.params.userId;
    Post.find({
            user: userId
        })
        .select('_id user producer classify category title content city price address images seller priority status note created_at updated_at')
        .populate('user', 'phoneNumber name address avatar')
        .populate('producer', 'title')
        .populate('classify', 'title')
        .populate('category', 'title')
        .populate('city', 'name location type')
        .exec()
        .then(posts => {
            const response = {
                count: posts.length,
                posts: posts.map(doc => {
                    return returnValueGet(doc);
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(404).json({
                message: 'No valid entry found for provided ID',
                error: err
            });
        });
}



exports.posts_get_post_accept_by_category = (req, res) => {
    const categoryId = req.params.categoryId;
    Post.find({
            status: 1,
            category: categoryId
        })
        .select('_id user producer classify category title content city price address images seller priority status note created_at updated_at')
        .populate('user', 'phoneNumber name address avatar')
        .populate('producer', 'title')
        .populate('classify', 'title')
        .populate('category', 'title')
        .populate('city', 'name location type')
        .exec()
        .then(posts => {
            const response = {
                count: posts.length,
                posts: posts.map(doc => {
                    return returnValueGet(doc);
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(404).json({
                message: 'No valid entry found for provided ID',
                error: err
            });
        });
}

exports.posts_get_post_accept_by_classify = (req, res) => {
    const classifyId = req.params.classifyId;
    Post.find({
            status: 1,
            classify: classifyId
        })
        .select('_id user producer classify category title content city price address images seller priority status note created_at updated_at')
        .populate('user', 'phoneNumber name address avatar')
        .populate('producer', 'title')
        .populate('classify', 'title')
        .populate('category', 'title')
        .populate('city', 'name location type')
        .exec()
        .then(posts => {
            const response = {
                count: posts.length,
                posts: posts.map(doc => {
                    return returnValueGet(doc);
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(404).json({
                message: 'No valid entry found for provided ID',
                error: err
            });
        });
}

exports.posts_get_post_accept_by_producer = (req, res) => {
    const producerId = req.params.producerId;
    Post.find({
            status: 1,
            producer: producerId
        })
        .select('_id user producer classify category title content price address city images seller priority status note created_at updated_at')
        .populate('user', 'phoneNumber name address avatar')
        .populate('producer', 'title')
        .populate('classify', 'title')
        .populate('category', 'title')
        .populate('city', 'name location type')
        .exec()
        .then(posts => {
            const response = {
                count: posts.length,
                posts: posts.map(doc => {
                    return returnValueGet(doc);
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(404).json({
                message: 'No valid entry found for provided ID',
                error: err
            });
        });
}

exports.accept_post = async (req, res) => {
    if (!await checkPermission(req.headers.authorization.split(" ")[1])) {
        return res.status(401).json({
            message: 'You don\'t have permission'
        });
    }

    const id = req.params.postId;
    Post.updateOne({
            _id: id
        }, {
            $set: {
                status: 1
            }
        })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Post accepted',
                PostURL: `${config.API_ADDRESS}/api/posts/` + id
            });
        })
        .catch(err => {
            res.status(500).json({
                message: 'No valid entry found for provided ID',
                error: err
            });
        });
}

exports.reject_post = async (req, res) => {
    if (!await checkPermission(req.headers.authorization.split(" ")[1])) {
        return res.status(401).json({
            message: 'You don\'t have permission'
        });
    }

    const id = req.params.postId;
    Post.updateOne({
            _id: id
        }, {
            $set: {
                status: -1
            }
        })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Post rejected',
                PostURL: `${config.API_ADDRESS}/api/posts/` + id
            });
        })
        .catch(err => {
            res.status(500).json({
                message: 'No valid entry found for provided ID',
                error: err
            });
        });
}

exports.posts_get_post_accept = async (req, res) => {
    if (!await checkPermission(req.headers.authorization.split(" ")[1])) {
        return res.status(401).json({
            message: 'You don\'t have permission'
        });
    }

    Post.find({
            status: 1
        })
        .select('_id user producer classify category title content price address city images seller priority status note created_at updated_at')
        .populate('user', 'phoneNumber name address avatar')
        .populate('producer', 'title')
        .populate('classify', 'title')
        .populate('category', 'title')
        .populate('city', 'name location type')
        .exec()
        .then(posts => {
            const response = {
                count: posts.length,
                posts: posts.map(doc => {
                    return returnValueGet(doc);
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}
exports.posts_get_post_reject = async (req, res) => {
    if (!await checkPermission(req.headers.authorization.split(" ")[1])) {
        return res.status(401).json({
            message: 'You don\'t have permission'
        });
    }

    Post.find({
            status: -1
        })
        .select('_id user producer classify category title content price address city images seller priority status note created_at updated_at')
        .populate('user', 'phoneNumber name address avatar')
        .populate('producer', 'title')
        .populate('classify', 'title')
        .populate('category', 'title')
        .populate('city', 'name location type')
        .exec()
        .then(posts => {
            const response = {
                count: posts.length,
                posts: posts.map(doc => {
                    return returnValueGet(doc);
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}
exports.posts_get_post_waiting = async (req, res) => {
    if (!await checkPermission(req.headers.authorization.split(" ")[1])) {
        return res.status(401).json({
            message: 'You don\'t have permission'
        });
    }

    Post.find({
            status: 0
        })
        .select('_id user producer classify category title content price address city images seller priority status note created_at updated_at')
        .populate('user', 'phoneNumber name address avatar')
        .populate('producer', 'title')
        .populate('classify', 'title')
        .populate('category', 'title')
        .populate('city', 'name location type')
        .exec()
        .then(posts => {
            const response = {
                count: posts.length,
                posts: posts.map(doc => {
                    return returnValueGet(doc);
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}

function checkPermission(tokenEncoded) {
    return new Promise(resolve => {
        const decoded = jwt.verify(tokenEncoded, config.JWT_KEY);
        if (decoded.isAdmin || decoded.isEmployee) {
            resolve(1);
        } else {
            resolve(0);
        }
    })
}

function getAllImagesNameInDB() {
    return new Promise((resolve, reject) => {
        var imageHaving = [];
        Post.find()
            .select('images')
            .then(result => {
                result.forEach(images => {
                    images.images.forEach(image => {
                        imageHaving.push(image);
                    });
                });
                resolve(imageHaving)
            })
            .catch(err => {
                reject(err)
            });
    })
}

function deleteImage(pathImage) {
    return new Promise((resolve, reject) => {
        fs.unlink(pathImage, (err) => {
            if (err) throw reject(err);
            resolve();
        });
    });
}

async function asyncDeleteImage(pathImage) {
    return await deleteImage(pathImage);
}

async function deleteArrayImage(listPathImage) {
    return await Promise.all(listPathImage.map(pathImage => asyncDeleteImage(pathImage)));
}

function saveImage(pathImage, base64String) {
    return new Promise((resolve, reject) => {
        let arrayBase64Image = base64String.split(';base64,');
        let typeFile = arrayBase64Image[0].split('/')[0];

        if (typeFile === 'data:image') {
            let typeImage = arrayBase64Image[0].split('/')[1];
            let base64Image = arrayBase64Image[1];
            let fileName = Date.now() + Math.floor(Math.random() * (1000000 - 1 + 1) + 1);

            fs.writeFile(pathImage + fileName + '.' + typeImage, base64Image, {
                encoding: 'base64'
            }, function (err) {
                if (err) reject(err);
                resolve(fileName + '.' + typeImage);
            });
        } else {
            reject('Wrong file format');
        }
    })
}

async function asyncSaveImage(pathImage, image) {
    return await saveImage(pathImage, image)
}

async function saveArrayImage(pathImage, arrayBase64) {
    return await Promise.all(arrayBase64.map(image => asyncSaveImage(pathImage, image)))
}

function returnValueGet(doc) {
    return {
        id: doc._id,
        user: doc.user,
        producer: doc.producer,
        classify: doc.classify,
        category: doc.category,
        title: doc.title,
        content: doc.content,
        price: doc.price,
        address: doc.address,
        city: doc.city,
        images: doc.images,
        seller: doc.seller,
        priority: doc.priority,
        status: doc.status,
        note: doc.note,
        createdAt: doc.created_at,
        updatedAt: doc.updated_at,
        request: {
            type: 'GET',
            PostURL: `${config.API_ADDRESS}/api/posts/${doc._id}`
        },
        //moment: moment().startOf('hour').from(doc.updated_at)
        moment: moment(doc.updated_at, 'YYYYMMDD').fromNow()
    }
}