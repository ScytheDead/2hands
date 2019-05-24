const Producer = require('../models/producers');
const Classify = require('../models/classifies');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const config = require('../../config');



exports.producers_get_all = async (req, res) => {
    Producer.find()
        .select('_id classify title image note created_at updated_at')
        .populate('classify', 'title')
        .exec()
        .then(producers => {
            const response = {
                count: producers.length,
                producers: producers.map(doc => {
                    return {
                        id: doc._id,
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
    if (!await checkPermission(req.headers.authorization.split(" ")[1])) {
        return res.status(401).json({
            message: 'You don\'t have permission'
        });
    }

    const id = req.params.producerId;
    Producer.findById(id)
        .select('_id classify title image note created_at updated_at')
        .populate('classify', 'title')
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

    Classify.findById(req.body.classify)
        .then(classify => {
            const CheckImage = req.file === undefined ? null : req.file.path;
            const producer = new Producer({
                _id: mongoose.Types.ObjectId(),
                classify: req.body.classify,
                title: req.body.title,
                image: CheckImage,
                note: req.body.note
            });
            producer.save()
                .then(result => {
                    res.status(201).json({
                        message: 'Created producer successful',
                        createdProducer: {
                            id: result._id,
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
                    if (req.file !== undefined && req.file !== null) {
                        fs.unlink(req.file.path, (err) => {
                            if (err) throw err;
                        });
                    }
                    res.status(500).json({
                        error: err
                    });
                });
        })
        .catch(err => {
            if (req.file !== undefined && req.file !== null) {
                fs.unlink(req.file.path, (err) => {
                    if (err) throw err;
                });
            }

            res.status(500).json({
                message: 'Classify not found',
                error: err
            });
        });
}

exports.producers_get_producer_by_classify = async (req, res) => {
    const classifyId = req.params.classifyId;
    Producer.find({classify: classifyId})
    .select('_id classify title image note created_at updated_at')
    .populate('classify', 'title')
    .exec()
    .then(producers => {
        const response = {
            count: producers.length,
            producers: producers.map(doc => {
                return {
                    id: doc._id,
                    classify: doc.classify,
                    title: doc.title,
                    image: doc.image,
                    createdAt: doc.created_at,
                    updatedAt: doc.updated_at,
                    note: doc.note,
                    request: {
                        type: 'GET',
                        ClassifyURL: `${config.API_ADDRESS}/api/producers/${doc._id}`
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

    Producer.updateOne({
            _id: id
        }, {
            $set: updateOps
        })
        .exec()
        .then(result => {
            console.log(result)
            res.status(200).json({
                message: 'Producer updated',
                ClassifyURL: `${config.API_ADDRESS}/api/producers/` + id
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

    const id = req.params.producerId;
    Producer.findById(id)
    .select('image')
    .exec()
    .then(result => {
        if(req.file !== undefined && req.file !== null){
            fs.unlink(result.image, (err) => {
                if(err)  throw err;
                Producer.updateOne({_id: id}, {$set: {"image": req.file.path}})
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: 'Producer image updated',
                        Category: `${config.API_ADDRESS}/api/producers/` + id
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