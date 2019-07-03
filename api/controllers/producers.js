const Producer = require('../models/producers');
const Classify = require('../models/classifies');
const Category = require('../models/categories');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const config = require('../../config');



exports.producers_get_all = async (req, res) => {
    Producer.find()
        .select('_id category classify title image note created_at updated_at')
        // .populate('classify', 'title')
        // .populate('category', 'title')
        .populate([{
                path: 'category',
                select: 'title'
            },
            {
                path: 'classify',
                select: 'title'
            }
        ])
        .exec()
        .then(producers => {
            const response = {
                count: producers.length,
                producers: producers.map(doc => {
                    return {
                        id: doc._id,
                        category: doc.category,
                        classify: doc.classify,
                        title: doc.title,
                        image: doc.image,
                        createdAt: doc.created_at,
                        updatedAt: doc.updated_at,
                        note: doc.note,
                        request: {
                            type: 'GET',
                            ProducersURL: `${config.API_ADDRESS}/api/producers/${doc._id}`
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

exports.producers_get_producer = async (req, res) => {
    const id = req.params.producerId;
    Producer.findById(id)
        .select('_id category classify title image note created_at updated_at')
        .populate('classify', 'title')
        .populate('category', 'title')
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    producer: doc,
                    request: {
                        type: 'GET',
                        AllProducersURL: `${config.API_ADDRESS}/api/producers/`
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

exports.producers_create_producer = async (req, res) => {
    if (!await checkPermission(req.headers.authorization.split(" ")[1])) {
        return res.status(401).json({
            message: 'You don\'t have permission'
        });
    }

    const pathImage = 'uploads/producers/';
    if (req.body.image !== undefined && req.body.image !== null) {
        saveImage(pathImage, req.body.image)
            .then(infoImage => {
                Category.findById(req.body.category)
                    .then(category => {
                        Classify.findById(req.body.classify)
                            .then(classify => {
                                if (classify.category._id.toString() === category._id.toString()) {
                                    const producer = new Producer({
                                        _id: new mongoose.Types.ObjectId(),
                                        category: req.body.category,
                                        classify: req.body.classify,
                                        title: req.body.title,
                                        image: pathImage + infoImage.fileName + '.' + infoImage.typeImage,
                                        note: req.body.note
                                    });
                                    producer.save()
                                        .then(result => {
                                            res.status(201).json({
                                                message: 'Created producer successful',
                                                createdProducer: {
                                                    id: result._id,
                                                    category: {
                                                        _id: result.category,
                                                        title: category.title
                                                    },
                                                    classify: {
                                                        _id: result.classify,
                                                        title: classify.title
                                                    },
                                                    title: result.title,
                                                    image: result.image,
                                                    note: result.note,
                                                    createdAt: result.created_at,
                                                    request: {
                                                        type: 'GET',
                                                        createdProducerURL: `${config.API_ADDRESS}/api/producers/` + result._id
                                                    }
                                                }
                                            });
                                        })
                                        .catch(err => {
                                            fs.unlink(pathImage + infoImage.fileName + '.' + infoImage.typeImage, (err) => {
                                                if (err) throw err;
                                            });

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
                                    fs.unlink(pathImage + infoImage.fileName + '.' + infoImage.typeImage, (err) => {
                                        if (err) throw err;
                                    });

                                    res.status(500).json({
                                        message: 'classify not of category'
                                    });
                                }
                            })
                            .catch(err => {
                                fs.unlink(pathImage + infoImage.fileName + '.' + infoImage.typeImage, (err) => {
                                    if (err) throw err;
                                });

                                res.status(500).json({
                                    message: 'Classify not found',
                                    error: err
                                });
                            });
                    })
                    .catch(err => {
                        fs.unlink(pathImage + infoImage.fileName + '.' + infoImage.typeImage, (err) => {
                            if (err) throw err;
                        });

                        res.status(500).json({
                            message: 'Category not found',
                            error: err
                        });
                    });
            })
            .catch(err => {
                res.status(422).json({
                    error: err
                });
            });
    } else {
        res.status(404).json({
            error: 'Not found image'
        });
    }
}

exports.producers_get_producer_by_category = async (req, res) => {
    const categoryId = req.params.categoryId;
    Producer.find({
            category: categoryId
        })
        .select('_id category classify title image note created_at updated_at')
        .populate('classify', 'title')
        .populate('category', 'title')
        .exec()
        .then(producers => {
            const response = {
                count: producers.length,
                producers: producers.map(doc => {
                    return {
                        id: doc._id,
                        category: doc.category,
                        classify: doc.classify,
                        title: doc.title,
                        image: doc.image,
                        createdAt: doc.created_at,
                        updatedAt: doc.updated_at,
                        note: doc.note,
                        request: {
                            type: 'GET',
                            producerURL: `${config.API_ADDRESS}/api/producers/${doc._id}`
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

exports.producers_get_producer_by_classify = async (req, res) => {
    const classifyId = req.params.classifyId;
    Producer.find({
            classify: classifyId,
        })
        .select('_id category classify title image note created_at updated_at')
        .populate('classify', 'title')
        .populate('category', 'title')
        .exec()
        .then(producers => {
            const response = {
                count: producers.length,
                producers: producers.map(doc => {
                    return {
                        id: doc._id,
                        category: doc.category,
                        classify: doc.classify,
                        title: doc.title,
                        image: doc.image,
                        createdAt: doc.created_at,
                        updatedAt: doc.updated_at,
                        note: doc.note,
                        request: {
                            type: 'GET',
                            producerURL: `${config.API_ADDRESS}/api/producers/${doc._id}`
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

exports.producers_update_producer = async (req, res) => {
    if (!await checkPermission(req.headers.authorization.split(" ")[1])) {
        return res.status(401).json({
            message: 'You don\'t have permission'
        });
    }

    const id = req.params.producerId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    if (updateOps.image !== undefined) {
        await delete updateOps.image;
    }

    // if (updateOps.classify !== undefined) {
    //     await delete updateOps.classify;
    // }

    // if (updateOps.category !== undefined) {
    //     await delete updateOps.category;
    // }

    Producer.updateOne({
            _id: id
        }, {
            $set: updateOps
        })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Producer updated',
                ProducerURL: `${config.API_ADDRESS}/api/producers/` + id
            });
        })
        .catch(err => {
            res.status(500).json({
                message: 'No valid entry found for provided ID',
                error: err
            });
        });
}
exports.producers_delete_producer = async (req, res) => {
    if (!await checkPermission(req.headers.authorization.split(" ")[1])) {
        return res.status(401).json({
            message: 'You don\'t have permission'
        });
    }

    const id = req.params.producerId;
    Producer.findById(id)
        .select('image')
        .exec()
        .then(result => {
            if (result.image !== undefined && result.image !== null) {
                fs.unlink(result.image, (err) => {
                    if (err) throw err;
                });
            }

            Producer.deleteOne({
                    _id: id
                })
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: 'Producer deleted'
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

exports.producers_update_image = async (req, res) => {
    if (!await checkPermission(req.headers.authorization.split(" ")[1])) {
        return res.status(401).json({
            message: 'You don\'t have permission'
        });
    }

    const pathImage = 'uploads/producers/';
    if (req.body.image !== undefined && req.body.image !== null) {
        saveImage(pathImage, req.body.image)
            .then(infoImage => {
                const id = req.params.producerId;
                Producer.findById(id)
                    .select('image')
                    .exec()
                    .then(result => {
                        fs.unlink(result.image, (err) => {
                            if (err) throw err;
                            Producer.updateOne({
                                    _id: id
                                }, {
                                    $set: {
                                        "image": pathImage + infoImage.fileName + '.' + infoImage.typeImage
                                    }
                                })
                                .exec()
                                .then(result => {
                                    res.status(200).json({
                                        message: 'Producer image updated',
                                        Category: `${config.API_ADDRESS}/api/producers/` + id
                                    });
                                })
                                .catch(err => {
                                    res.status(500).json({
                                        message: 'No valid entry found for provided ID',
                                        error: err
                                    });
                                });
                        });
                    })
                    .catch(err => {
                        fs.unlink(req.file.path, (err) => {
                            if (err) throw err;
                        });

                        res.status(500).json({
                            message: 'No valid entry found for provided ID',
                            error: err
                        });
                    });
            })
            .catch(err => {
                res.status(422).json({
                    error: err
                });
            });
    } else {
        res.status(404).json({
            message: 'Not found image',
        });
    }
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

function saveImage(pathImage, base64String) {
    return new Promise((resolve, reject) => {
        let arrayBase64Image = base64String.split(';base64,');
        let typeFile = arrayBase64Image[0].split('/')[0];

        if (typeFile === 'data:image') {
            let typeImage = arrayBase64Image[0].split('/')[1];
            let base64Image = arrayBase64Image[1];
            let fileName = Date.now();

            fs.writeFile(pathImage + fileName + '.' + typeImage, base64Image, {
                encoding: 'base64'
            }, function (err) {
                if (err) reject(err);
                var infoImageArray = [];
                infoImageArray['typeImage'] = typeImage;
                infoImageArray['fileName'] = fileName;
                resolve(infoImageArray);

            });
        } else {
            reject('Wrong file format');
        }
    })
}