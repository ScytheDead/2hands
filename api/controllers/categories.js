const Category = require('../models/categories');
const Classify = require('../models/classifies');
const Producer = require('../models/producers');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const config = require('../../config');
//

exports.categories_get_all = (req, res) => {
    Category.find()
        .select('_id title note image created_at updated_at')
        .exec()
        .then(categories => {
            const response = {
                count: categories.length,
                categories: categories.map(doc => {
                    return {
                        id: doc._id,
                        title: doc.title,
                        image: doc.image,
                        createdAt: doc.created_at,
                        updatedAt: doc.updated_at,
                        note: doc.note,
                        request: {
                            type: 'GET',
                            url: `${config.API_ADDRESS}/api/categories/${doc._id}`
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

exports.categories_create_category = async (req, res) => {
    if (!await checkPermission(req.headers.authorization.split(" ")[1])) {
        return res.status(401).json({
            message: 'You don\'t have permission'
        });
    }

    const pathImage = 'uploads/categories/';
    if (req.body.image !== undefined && req.body.image !== null) {
        saveImage(pathImage, req.body.image)
            .then(infoImage => {
                const category = new Category({
                    _id: new mongoose.Types.ObjectId(),
                    title: req.body.title,
                    image: pathImage + infoImage.fileName + '.' + infoImage.typeImage,
                    note: req.body.note
                });
                category.save()
                    .then(result => {
                        res.status(201).json({
                            message: 'Created category successful',
                            createdCategory: {
                                id: result._id,
                                title: result.title,
                                image: result.image,
                                note: result.note,
                                createdAt: result.created_at,
                                request: {
                                    type: 'GET',
                                    url: `${config.API_ADDRESS}/api/categories/` + result._id
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

exports.categories_get_category = async (req, res) => {
    const id = req.params.categoryId;
    Category.findById(id)
        .select('_id title image note created_at updated_at')
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    category: doc,
                    request: {
                        type: 'GET',
                        url: `${config.API_ADDRESS}/api/categories/`
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
        });
}

exports.categories_delete_category = async (req, res) => {
    if (!await checkPermission(req.headers.authorization.split(" ")[1])) {
        return res.status(401).json({
            message: 'You don\'t have permission'
        });
    }

    const categoryId = req.params.categoryId;

    Classify.find({
            category: req.params.categoryId
        })
        .then(classifies => {
            if (classifies.length > 0) {
                res.status(500).json({
                    message: 'This category have still contains classify'
                });
            } else {
                Producer.find({
                        category: req.params.categoryId
                    })
                    .then(producers => {
                        if (producers.length > 0) {
                            res.status(500).json({
                                message: 'This category have still contains producer'
                            });
                        } else {
                            Category.findById(categoryId)
                                .select('image')
                                .exec()
                                .then(result => {
                                    if (result.image !== undefined && result.image !== null) {
                                        fs.unlink(result.image, (err) => {
                                            if (err) throw err;
                                        });
                                    }

                                    Category.deleteOne({
                                            _id: categoryId
                                        })
                                        .exec()
                                        .then(result => {
                                            res.status(200).json({
                                                message: 'Category deleted'
                                            });
                                        })
                                })
                                .catch(err => {
                                    res.status(500).json({
                                        message: 'No valid entry found for provided ID',
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
                    });
            }
        })
        .catch(err => {
            res.status(500).json({
                message: 'No valid entry found for provided ID',
                error: err
            });
        });
}

exports.categories_update_category = async (req, res) => {
    if (!await checkPermission(req.headers.authorization.split(" ")[1])) {
        return res.status(401).json({
            message: 'You don\'t have permission'
        });
    }
    const id = req.params.categoryId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    if (updateOps.image !== undefined) {
        await delete updateOps.image;
    }

    Category.updateOne({
            _id: id
        }, {
            $set: updateOps
        })
        .exec()
        .then(result => {
            if (result.n <= 0) {
                return res.status(500).json({
                    error: "Not found category"
                });
            }
            res.status(200).json({
                message: 'Category updated',
                Category: `${config.API_ADDRESS}/api/categories/` + id
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}


exports.categories_update_image = async (req, res) => {
    if (!await checkPermission(req.headers.authorization.split(" ")[1])) {
        return res.status(401).json({
            message: 'You don\'t have permission'
        });
    }

    const pathImage = 'uploads/categories/';
    if (req.body.image !== undefined && req.body.image !== null) {
        saveImage(pathImage, req.body.image)
            .then(infoImage => {
                const id = req.params.categoryId;
                Category.findById(id)
                    .select('image')
                    .exec()
                    .then(result => {
                        fs.unlink(result.image, (err) => {
                            if (err) throw err;

                            Category.updateOne({
                                    _id: id
                                }, {
                                    $set: {
                                        "image": pathImage + infoImage.fileName + '.' + infoImage.typeImage
                                    }
                                })
                                .exec()
                                .then(result => {
                                    res.status(200).json({
                                        message: 'Category image updated',
                                        Category: `${config.API_ADDRESS}/api/categories/` + id
                                    });
                                })
                                .catch(err => {
                                    fs.unlink(pathImage + infoImage.fileName + '.' + infoImage.typeImage, (err) => {
                                        if (err) throw err;
                                    });
                                    
                                    res.status(500).json({
                                        error: err
                                    });
                                });
                        });
                    })
                    .catch(err => {
                        fs.unlink(pathImage + infoImage.fileName + '.' + infoImage.typeImage, (err) => {
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
            })
    } else {
        res.status(404).json({
            error: 'Not found image'
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