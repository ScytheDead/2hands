const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/users');

exports.user_signup = (req, res, next) => {
    User.find({
            phoneNumber: req.body.phoneNumber
        })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({ //409: conflict, 422: unprocess about entity
                    message: 'Phone number exists'
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            phoneNumber: req.body.phoneNumber,
                            password: hash
                        });
                        user
                            .save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: 'User created'
                                });
                            })
                            .catch(err => {
                                res.status(500).json({
                                    error: err
                                });
                            })
                    }
                });
            }
        })
}

exports.user_login = (req, res, next) => {
    User.findOne({
            phoneNumber: req.body.phoneNumber
        })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Auth failed'
                    });
                }
                if (result) {
                    const token = jwt.sign( //parse dữ liệu thành chuỗi token
                        {
                            phoneNumber: user.phoneNumber,
                            userId: user._id,
                            permission: user.permission,
                            messages: user.messages,
                            subscribes: user.subscribes,
                            createdAt: user.created_at,
                            name: user.name,
                            address: user.address,
                            avatar: user.avatar,
                            facebook: user.facebook,
                            email: user.email,
                            gender: user.gender,

                        },
                        process.env.JWT_KEY, {
                            expiresIn: '1h'
                        }
                    );
                    return res.status(200).json({
                        message: 'Auth successful',
                        token: token //gửi chuỗi token về client
                    });
                }
                res.status(401).json({
                    message: 'Auth failed'
                });
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}

exports.user_update = (req, res, next) => {
    const id = req.params.userId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    //check permission if update permission
    if (updateOps.permission !== undefined) {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        User.findById({
                _id: decoded.userId
            }).exec()
            .then(user => {
                if (user.permission != 2) {
                    return res.status(401).json({
                        messages: 'You don\'t have permission'
                    });
                } else {
                    User.updateOne({
                            _id: id
                        }, {
                            $set: updateOps
                        })
                        .exec()
                        .then(result => {
                            if (result.n <= 0) {
                                return res.status(500).json({
                                    error: "Not found user"
                                });
                            }
                            res.status(200).json({
                                message: 'User updated',
                            });
                        })
                }
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                });
            });
    } else {
        User.updateOne({
                _id: id
            }, {
                $set: updateOps
            })
            .exec()
            .then(result => {
                if (result.n <= 0) {
                    return res.status(500).json({
                        error: "Not found user"
                    });
                }
                res.status(200).json({
                    message: 'User updated',

                })
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                });
            });
    }
}

exports.user_delete = (req, res, next) => {
    User.deleteOne({
            _id: req.params.userId
        })
        .exec()
        .then(result => {
            if (result.deletedCount <= 0) {
                return res.status(500).json({
                    error: "Not found user"
                });
            }
            res.status(200).json({
                message: 'User deleted'
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}