const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const User = require('../models/users');
const config = require('../../config');

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
                        // config.JWT_KEY, {
                        config.JWT_KEY, {
                            expiresIn: '2h'
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

exports.users_get_all = async (req, res) => {
    if (!await checkPermission(req.headers.authorization.split(" ")[1])) {
        return res.status(401).json({
            message: 'You don\'t have permission'
        });
    }

    User.find()
        .select('_id phoneNumber permission messages subscribes created_at updated_at name address avatar facebook email gender')
        .exec()
        .then(users => {
            const response = {
                count: users.length,
                users: users.map(user => {
                    return {
                        id: user._id,
                        phoneNumber: user.phoneNumber,
                        permission: user.permission,
                        messages: user.messages,
                        subscribes: user.subscribes,
                        createdAt: user.created_at,
                        updatedAt: user.updated_at,
                        name: user.name,
                        address: user.address,
                        avatar: user.avatar,
                        facebook: user.facebook,
                        email: user.email,
                        gender: user.gender,
                        request: {
                            type: 'GET',
                            url: `${config.API_ADDRESS}/users/${user._id}`
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

exports.users_get_user = async (req, res) => {
    if (!await checkPermission(req.headers.authorization.split(" ")[1])) {
        return res.status(401).json({
            message: 'You don\'t have permission'
        });
    }

    const id = req.params.userId;
    User.findById(id)
        .select('_id phoneNumber permission messages subscribes created_at updated_at name address avatar facebook email gender')
        .exec()
        .then(user => {
            res.status(200).json({
                user: user,
                request: {
                    type: 'GET',
                    url: `${config.API_ADDRESS}/users/`
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                message: 'No valid entry found for provided ID',
                error: err
            });
        });
}

exports.user_update = async (req, res) => {
    const id = req.params.userId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }

    //check permission if update permission
    if (updateOps.permission !== undefined) {
        const permission = await checkPermission(req.headers.authorization.split(" ")[1]);
        if (!permission)
            return res.status(401).json({
                message: 'You don\'t have permission'
            });
    }

    //if update password
    if (updateOps.password !== undefined) {
        updateOps.password = await hash(updateOps.password);
    }

    //if update avatar
    if (updateOps.avatar !== undefined) {
        delete updateOps.avatar;
    }

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

exports.user_delete = async (req, res) => {
    if (!await checkPermission(req.headers.authorization.split(" ")[1])) {
        return res.status(401).json({
            messages: 'You don\'t have permission'
        });
    }

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

exports.user_update_avatar = (req, res) => {
    const id = req.params.userId;
    User.findById(id)
        .select('avatar')
        .exec()
        .then(async result => {
            if (result.avatar !== undefined && result.avatar !== null) {
                fs.unlink(result.avatar, (err) => {
                    if (err) {
                        res.status(500).json({
                            message: 'You don\'t have avatar'
                        });
                    }
                });
            }
            User.updateOne({
                    _id: id
                }, {
                    $set: {
                        "avatar": req.file !== undefined ? req.file.path : undefined
                    }
                })
                .exec()
                .then(result => {
                    res.status(200).json({
                        message: 'Users avatar updated',
                    });
                })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

function checkPermission(tokenEncoded) {
    return new Promise(resolve => {
        const decoded = jwt.verify(tokenEncoded, config.JWT_KEY);
        if (decoded.permission != 2) {
            resolve(0);
        } else {
            resolve(1);
        }
    });
}

function hash(password) {
    return new Promise(resolve => {
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                return res.status(500).json({
                    error: err
                });
            } else {
                resolve(hash);
            }

        })
    })
}