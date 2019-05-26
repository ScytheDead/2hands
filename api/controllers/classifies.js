const Classify = require('../models/classifies');
const Category = require('../models/categories');
const Producer = require('../models/producers');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const config = require('../../config');


exports.classifies_get_all = (req, res) => {
    Classify.find()
        .select('_id category title image note created_at updated_at')
        .populate('category', 'title')
        .exec()
        .then(classifies => {
            const response = {
                count: classifies.length,
                classifies: classifies.map(doc => {
                    return {
                        id: doc._id,
                        category: doc.category,
                        title: doc.title,
                        image: doc.image,
                        createdAt: doc.created_at,
                        updatedAt: doc.updated_at,
                        note: doc.note,
                        request: {
                            type: 'GET',
                            ClassifyURL: `${config.API_ADDRESS}/api/classifies/${doc._id}`
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

exports.classifies_create_classify = async (req, res) => {
    if (!await checkPermission(req.headers.authorization.split(" ")[1])) {
        return res.status(401).json({
            message: 'You don\'t have permission'
        });
    }

    const pathImage = 'uploads/classifies/';
    if (req.body.image !== undefined && req.body.image !== null) {
        saveImage(pathImage, req.body.image)
            .then(infoImage => {
                Category.findById(req.body.category)
                    .then(category => {
                        const classify = new Classify({
                            _id: new mongoose.Types.ObjectId(),
                            category: req.body.category,
                            title: req.body.title,
                            image: pathImage + infoImage.fileName + '.' + infoImage.typeImage,
                            note: req.body.note
                        });
                        classify.save()
                            .then(result => {
                                res.status(201).json({
                                    message: 'Created classify successful',
                                    createdClassify: {
                                        id: result._id,
                                        category: {
                                            _id: result.category,
                                            title: category.title
                                        },
                                        title: result.title,
                                        image: result.image,
                                        note: result.note,
                                        createdAt: result.created_at,
                                        request: {
                                            type: 'GET',
                                            createdClassifyURL: `${config.API_ADDRESS}/api/classifies/` + result._id
                                        }
                                    }
                                });
                            })
                            .catch(err => {
                                fs.unlink(req.file.path, (err) => {
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
                    })
                    .catch(err => {
                        fs.unlink(req.file.path, (err) => {
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

exports.classifies_get_classify = async (req, res) => {
    if (!await checkPermission(req.headers.authorization.split(" ")[1])) {
        return res.status(401).json({
            message: 'You don\'t have permission'
        });
    }

    const id = req.params.classifyId;
    Classify.findById(id)
        .select('_id category title image note created_at updated_at')
        .populate('category', 'title')
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    classify: doc,
                    request: {
                        type: 'GET',
                        AllClassifiesURL: `${config.API_ADDRESS}/api/classifies/`
                    }
                });
            } else {
                res.status(404).json({
                    message: 'No valid entry found for provided ID'
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                message: 'No valid entry found for provided ID',
                error: err
            });
        })
}

exports.classifies_get_classify_by_category = (req, res) => {
    const CategoryId = req.params.categoryId;
    Classify.find({
            category: CategoryId
        })
        .select('_id category title image note created_at updated_at')
        .populate('category', 'title')
        .exec()
        .then(classifies => {
            const response = {
                count: classifies.length,
                classifies: classifies.map(doc => {
                    return {
                        id: doc._id,
                        category: doc.category,
                        title: doc.title,
                        image: doc.image,
                        createdAt: doc.created_at,
                        updatedAt: doc.updated_at,
                        note: doc.note,
                        request: {
                            type: 'GET',
                            ClassifyURL: `${config.API_ADDRESS}/api/classifies/${doc._id}`
                        }
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(404).json({
                message: 'No valid entry found for provided Category ID',
                error: err
            });
        });
}

exports.classifies_update_classify = async (req, res) => {
    if (!await checkPermission(req.headers.authorization.split(" ")[1])) {
        return res.status(401).json({
            message: 'You don\'t have permission'
        });
    }

    const id = req.params.classifyId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    if (updateOps.image !== undefined) {
        await delete updateOps.image;
    }

    Classify.updateOne({
            _id: id
        }, {
            $set: updateOps
        })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Classify updated',
                ClassifyURL: `${config.API_ADDRESS}/api/classifies/` + id
            });
        })
        .catch(err => {
            res.status(500).json({
                message: 'No valid entry found for provided Classify ID',
                error: err
            });
        });
}

exports.classifies_delete_classify = async (req, res) => {
    if (!await checkPermission(req.headers.authorization.split(" ")[1])) {
        return res.status(401).json({
            message: 'You don\'t have permission'
        });
    }

    const classifyId = req.params.classifyId;

    Producer.find({
            classify: classifyId
        })
        .then(producers => {
            if (producers.length > 0) {
                res.status(500).json({
                    message: 'This classify have still contains producer'
                });
            } else {
                Classify.findById(classifyId)
                    .select('image')
                    .exec()
                    .then(result => {
                        if (result.image !== undefined && result.image !== null) {
                            fs.unlink(result.image, (err) => {
                                if (err) throw err;
                            });
                        }

                        Classify.deleteOne({
                                _id: classifyId
                            })
                            .exec()
                            .then(result => {
                                res.status(200).json({
                                    message: 'Classify deleted'
                                });
                            })
                    })
                    .catch(err => {
                        res.status(500).json({
                            message: 'No valid entry found for provided Classify ID',
                            error: err
                        });
                    });
            }
        })
        .catch(err => {
            res.status(500).json({
                message: 'No valid entry found for provided ID',
                error: err
            });
        })
}

exports.classifies_update_image = async (req, res) => {
    if (!await checkPermission(req.headers.authorization.split(" ")[1])) {
        return res.status(401).json({
            message: 'You don\'t have permission'
        });
    }

    const pathImage = 'uploads/classifies/';
    if (req.body.image !== undefined && req.body.image !== null) {
        saveImage(pathImage, req.body.image)
            .then(infoImage => {
                const id = req.params.classifyId;
                Classify.findById(id)
                    .select('image')
                    .exec()
                    .then(result => {
                        fs.unlink(result.image, (err) => {
                            if (err) throw err;
                            Classify.updateOne({
                                    _id: id
                                }, {
                                    $set: {
                                        "image": pathImage + infoImage.fileName + '.' + infoImage.typeImage
                                    }
                                })
                                .exec()
                                .then(result => {
                                    res.status(200).json({
                                        message: 'Classify image updated',
                                        Category: `${config.API_ADDRESS}/api/classifies/` + id
                                    });
                                })
                                .catch(err => {
                                    res.status(500).json({
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