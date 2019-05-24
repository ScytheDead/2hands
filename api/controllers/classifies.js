const Classify = require('../models/classifies');
const Category = require('../models/categories');
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

    Category.findById(req.body.category)
        .then(category => {
            const CheckImage = req.file === undefined ? null : req.file.path;
            const classify = new Classify({
                _id: mongoose.Types.ObjectId(),
                category: req.body.category,
                title: req.body.title,
                image: CheckImage,
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
                    if (req.file !== undefined && req.file !== null) {
                        fs.unlink(req.file.path, (err) => {
                            if (err) throw err;
                        });
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
        })
        .catch(err => {
            if (req.file !== undefined && req.file !== null) {
                fs.unlink(req.file.path, (err) => {
                    if (err) throw err;
                });
            }

            res.status(500).json({
                message: 'Category not found',
                error: err
            });
        });
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
    Classify.find({category: CategoryId})
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

    const id = req.params.classifyId;
    Classify.findById(id)
        .select('image')
        .exec()
        .then(result => {
            if (result.image !== undefined && result.image !== null) {
                fs.unlink(result.image, (err) => {
                    if (err) throw err;
                });
            }

            Classify.deleteOne({
                    _id: id
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
            })
        });
}

exports.classifies_update_image = async (req, res) => {
    if (!await checkPermission(req.headers.authorization.split(" ")[1])) {
        return res.status(401).json({
            message: 'You don\'t have permission'
        });
    }

    const id = req.params.classifyId;
    Classify.findById(id)
    .select('image')
    .exec()
    .then(result => {
        if(req.file !== undefined && req.file !== null){
            fs.unlink(result.image, (err) => {
                if(err)  throw err;
                Classify.updateOne({_id: id}, {$set: {"image": req.file.path}})
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: 'Classify image updated',
                        Category: `${config.API_ADDRESS}/api/classifies/` + id
                    })
                })
            });
        } else {
            res.status(404).json({
                error: err
            });
        }
    })
    .catch(err => {
        if (req.file !== undefined && req.file !== null) {
            fs.unlink(req.file.path, (err) => {
                if (err) throw err;
            });
        }

        if(err.kind == 'ObjectId'){
            res.status(500).json({
                message: 'No valid entry found for provided ID',
                error: err
            });
        }else{
            res.status(404).json({
                message: 'Not found image',
                error: err
            });
        }    
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