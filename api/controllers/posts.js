const Producer = require('../models/producers');
const Classify = require('../models/classifies');
const Category = require('../models/categories');
const Post = require('../models/posts');
const User = require('../models/users');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const config = require('../../config');


exports.posts_get_all = (req, res) => {
    Post.find()
        .select('_id user producer classify category title content price images seller priority status note created_at updated_at')
        .populate('producer', 'title')
        .populate('classify', 'title')
        .populate('category', 'title')
        .exec()
        .then(posts => {
            const response = {
                count: posts.length,
                posts: posts.map(doc => {
                    return {
                        id: doc._id,
                        user: doc.user,
                        producer: doc.producer,
                        classify: doc.classify,
                        category: doc.category,
                        title: doc.title,
                        content: doc.content,
                        price: doc.price,
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
                        }
                    }
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
    User.findById(req.body.user) //check User available
        .then(user => {
            Category.findById(req.body.category) //check Category available
                .then(category => {
                    Classify.findById(req.body.classify) //check Classify available
                        .then(classify => {
                            if (classify.category._id.toString() === category._id.toString()) { //check classify in category
                                Producer.findById(req.body.producer) //check Producer available
                                    .then(async producer => {
                                        if (producer.category._id.toString() === category._id.toString()) { //check producer in category
                                            if (producer.classify._id.toString() === classify._id.toString()) { //check producer in classify
                                                var arrayImage = [];
                                                if (req.body.images !== undefined && req.body.images !== null) {
                                                    const pathImage = 'uploads/posts/';
                                                    await saveArrayImage(pathImage, req.body.images)
                                                        .then(arrayNameImage => {
                                                            arrayImage = arrayNameImage;
                                                            arrayImage.forEach((image, index) => {
                                                                arrayImage[index] = pathImage + image;
                                                            })
                                                        })
                                                        .catch(err => {
                                                            res.status(422).json({
                                                                error: err
                                                            });
                                                        })
                                                }

                                                // user category classify producer title content price images seller note
                                                const post = new Post({
                                                    _id: new mongoose.Types.ObjectId(),
                                                    user: req.body.user,
                                                    category: req.body.category,
                                                    classify: req.body.classify,
                                                    producer: req.body.producer,
                                                    title: req.body.title,
                                                    content: req.body.content,
                                                    price: req.body.price,
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
                                                                    name: user.name
                                                                },
                                                                category: {
                                                                    _id: result.category,
                                                                    title: category.title
                                                                },
                                                                classify: {
                                                                    _id: result.classify,
                                                                    title: classify.title
                                                                },
                                                                producer: {
                                                                    _id: result.producer,
                                                                    title: producer.title
                                                                },
                                                                title: result.title,
                                                                content: result.content,
                                                                price: result.price,
                                                                images: result.images,
                                                                seller: result.seller,
                                                                priority: result.priority,
                                                                status: result.status,
                                                                note: result.note,
                                                                createdAt: result.created_at,
                                                                request: {
                                                                    type: 'GET',
                                                                    createdPostURL: `${config.API_ADDRESS}/api/posts/` + result._id
                                                                }
                                                            }
                                                        });
                                                    })
                                                    .catch(err => {
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
                                            } else {
                                                res.status(500).json({
                                                    message: 'Producer not of classify'
                                                });
                                            }
                                        } else {
                                            res.status(500).json({
                                                message: 'Producer not of category'
                                            });
                                        }
                                    })
                                    .catch(err => {
                                        res.status(500).json({
                                            message: 'Producer not found',
                                            error: err
                                        });
                                    });
                            } else {
                                res.status(500).json({
                                    message: 'classify not of category'
                                });
                            }
                        })
                        .catch(err => {
                            res.status(500).json({
                                message: 'Classify not found',
                                error: err
                            });
                        });
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
        .select('_id user producer classify category title content price images seller priority status note created_at updated_at')
        .populate('producer', 'title')
        .populate('classify', 'title')
        .populate('category', 'title')
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    post: doc,
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
    }

    if (flagUpdate) {
        updateOps.images = arrayImage;
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
        .select('_id user producer classify category title content price images seller priority status note created_at updated_at')
        .populate('producer', 'title')
        .populate('classify', 'title')
        .populate('category', 'title')
        .exec()
        .then(posts => {
            const response = {
                count: posts.length,
                posts: posts.map(doc => {
                    return {
                        id: doc._id,
                        user: doc.user,
                        producer: doc.producer,
                        classify: doc.classify,
                        category: doc.category,
                        title: doc.title,
                        content: doc.content,
                        price: doc.price,
                        images: doc.images,
                        seller: doc.seller,
                        priority: doc.priority,
                        status: doc.status,
                        note: doc.note,
                        createdAt: doc.created_at,
                        updatedAt: doc.updated_at,
                        request: {
                            type: 'GET',
                            postURL: `${config.API_ADDRESS}/api/posts/${doc._id}`
                        }
                    }
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

exports.posts_get_post_by_category = (req, res) => {
    const categoryId = req.params.categoryId;
    Post.find({
            category: categoryId
        })
        .select('_id user producer classify category title content price images seller priority status note created_at updated_at')
        .populate('producer', 'title')
        .populate('classify', 'title')
        .populate('category', 'title')
        .exec()
        .then(posts => {
            const response = {
                count: posts.length,
                posts: posts.map(doc => {
                    return {
                        id: doc._id,
                        user: doc.user,
                        producer: doc.producer,
                        classify: doc.classify,
                        category: doc.category,
                        title: doc.title,
                        content: doc.content,
                        price: doc.price,
                        images: doc.images,
                        seller: doc.seller,
                        priority: doc.priority,
                        status: doc.status,
                        note: doc.note,
                        createdAt: doc.created_at,
                        updatedAt: doc.updated_at,
                        request: {
                            type: 'GET',
                            postURL: `${config.API_ADDRESS}/api/posts/${doc._id}`
                        }
                    }
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

exports.posts_get_post_by_classify = (req, res) => {
    const classifyId = req.params.classifyId;
    Post.find({
            classify: classifyId
        })
        .select('_id user producer classify category title content price images seller priority status note created_at updated_at')
        .populate('producer', 'title')
        .populate('classify', 'title')
        .populate('category', 'title')
        .exec()
        .then(posts => {
            const response = {
                count: posts.length,
                posts: posts.map(doc => {
                    return {
                        id: doc._id,
                        user: doc.user,
                        producer: doc.producer,
                        classify: doc.classify,
                        category: doc.category,
                        title: doc.title,
                        content: doc.content,
                        price: doc.price,
                        images: doc.images,
                        seller: doc.seller,
                        priority: doc.priority,
                        status: doc.status,
                        note: doc.note,
                        createdAt: doc.created_at,
                        updatedAt: doc.updated_at,
                        request: {
                            type: 'GET',
                            postURL: `${config.API_ADDRESS}/api/posts/${doc._id}`
                        }
                    }
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

exports.posts_get_post_by_producer = (req, res) => {
    const producerId = req.params.producerId;
    Post.find({
            producer: producerId
        })
        .select('_id user producer classify category title content price images seller priority status note created_at updated_at')
        .populate('producer', 'title')
        .populate('classify', 'title')
        .populate('category', 'title')
        .exec()
        .then(posts => {
            const response = {
                count: posts.length,
                posts: posts.map(doc => {
                    return {
                        id: doc._id,
                        user: doc.user,
                        producer: doc.producer,
                        classify: doc.classify,
                        category: doc.category,
                        title: doc.title,
                        content: doc.content,
                        price: doc.price,
                        images: doc.images,
                        seller: doc.seller,
                        priority: doc.priority,
                        status: doc.status,
                        note: doc.note,
                        createdAt: doc.created_at,
                        updatedAt: doc.updated_at,
                        request: {
                            type: 'GET',
                            postURL: `${config.API_ADDRESS}/api/posts/${doc._id}`
                        }
                    }
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