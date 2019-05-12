const Category = require('../models/categories');
const User = require('../models/users');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const host = require('../../config');

exports.categories_get_all = (req, res) => {
    Category.find()
    .select('_id title image updated_at')
    .exec()
    .then(categories => {
        const response = {
            count: categories.length,
            categories: categories.map(doc => {
                return {
                    id: doc._id,
                    title: doc.title,
                    image: doc.image,
                    updatedAt: doc.updated_at,
                    request: {
                        type: 'GET',
                        url: `${host}/categories/` + doc._id
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
    if(! await checkPermission()){
        return res.status(401).json({
            message: 'You don\'t have permission'
        });
    }

    console.log(req.file)
    const category = new Category({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        image: req.file.path,
        note: req.body.note
    });
    category.save()
    .then(result => {
        res.status(200).json({
            message: 'Created category successful',
            createCategory: {
                id: result._id,
                title: result.title,
                image: result.image,
                note: result.note,
                createdAt: result.created_at,
                request: {
                    type: 'GET',
                    url: `${host}/categories/` + result._id
                }
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    });

    function checkPermission() {
        return new Promise(resolve => {
            const token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_KEY);
            User.findById({
                    _id: decoded.userId
                }).exec()
                .then(user => {
                    if (user.permission == 0) {
                        resolve(0);
                    } else {
                        resolve(1);
                    }
                }).catch(err => {
                    res.status(500).json({
                        error: err
                    });
                });
        })
    }
}

exports.categories_get_category = async (req, res) => {
    if(! await checkPermission()){
        return res.status(401).json({
            message: 'You don\'t have permission'
        });
    }

    const id = req.params.categoryId;
    Category.findById(id)
    .select('_id title image note created_at updated_at')
    .exec()
    .then(doc => {
        if(doc) {
            res.status(200).json({
                category: doc,
                request: {
                    type: 'GET',
                    url: `${host}/categories/`
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
        })
    });

    function checkPermission() {
        return new Promise(resolve => {
            const token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_KEY);
            User.findById({
                    _id: decoded.userId
                }).exec()
                .then(user => {
                    if (user.permission == 0) {
                        resolve(0);
                    } else {
                        resolve(1);
                    }
                }).catch(err => {
                    res.status(500).json({
                        error: err
                    });
                });
        })
    }
}

exports.categories_delete_category = async (req, res) => {
    if(! await checkPermission()){
        return res.status(401).json({
            message: 'You don\'t have permission'
        });
    }

    const id = req.params.categoryId;
    Category.findById(id)
    .select('image')
    .exec()
    .then(result => {
        fs.unlink(result.image, (err) => {
            if(err)  throw err;
            Category.deleteOne({_id: id})
            .exec()
            .then(result => {
                res.status(200).json({
                    message: 'Category deleted'
                });
            })
        })
    })
    .catch(err => {
            res.status(500).json({
                error: 'No valid entry found for provided ID'
            })
    });

    function checkPermission() {
        return new Promise(resolve => {
            const token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_KEY);
            User.findById({
                    _id: decoded.userId
                }).exec()
                .then(user => {
                    if (user.permission == 0) {
                        resolve(0);
                    } else {
                        resolve(1);
                    }
                }).catch(err => {
                    res.status(500).json({
                        error: err
                    });
                });
        })
    }
}

exports.categories_update_category = async (req, res) => {
    if(! await checkPermission()){
        return res.status(401).json({
            message: 'You don\'t have permission'
        });
    }
    const id = req.params.categoryId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    if(updateOps.image !== undefined) {
        await removeImage();
    }

    Category.updateOne({_id: id}, {$set: updateOps})
    .exec()
    .then(result => {
        if (result.n <= 0) {
            return res.status(500).json({
                error: "Not found category"
            });
        }
        res.status(200).json({
            message: 'Category updated',
            Category: `${host}/categories/` + id
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });

    function removeImage(){
        delete updateOps.image;
    }

    function checkPermission() {
        return new Promise(resolve => {
            const token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_KEY);
            User.findById({
                    _id: decoded.userId
                }).exec()
                .then(user => {
                    if (user.permission == 0) {
                        resolve(0);
                    } else {
                        resolve(1);
                    }
                }).catch(err => {
                    res.status(500).json({
                        error: err
                    });
                });
        })
    }
}

exports.categories_update_image = async (req, res) => {
    if(! await checkPermission()){
        return res.status(401).json({
            message: 'You don\'t have permission'
        });
    }

    const id = req.params.categoryId;
    Category.findById(id)
    .select('image')
    .exec()
    .then(result => {
        fs.unlink(result.image, (err) => {
            if(err)  throw err;
            Category.updateOne({_id: id}, {$set: {"image": req.file.path}})
            .exec()
            .then(result => {
                res.status(200).json({
                    message: 'Category image updated',
                    Category: `${host}/categories/` + id
                })
            })
        });
    })
    .catch(err => {
        res.status(500).json({
            error: 'No valid entry found for provided ID'
        })
    });

    function checkPermission() {
        return new Promise(resolve => {
            const token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_KEY);
            User.findById({
                    _id: decoded.userId
                }).exec()
                .then(user => {
                    if (user.permission == 0) {
                        resolve(0);
                    } else {
                        resolve(1);
                    }
                }).catch(err => {
                    res.status(500).json({
                        error: err
                    });
                });
        })
    }
}
