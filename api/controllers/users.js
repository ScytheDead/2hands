const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const User = require('../models/users');
const Post = require('../models/posts');
const config = require('../../config');
const moment = require('moment');
moment.locale('vi');

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
                        user.save()
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
        .select('_id phoneNumber password name address avatar facebook email gender isAdmin isEmployee isUser status subscribes messages note')
        .populate('messages', '_id userSell userBuy post')
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'Auth failed'
                });
            }
            bcrypt.compare(req.body.password, user.password, async (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: 'Auth failed'
                    });
                }
                if (result) {
                    const token = jwt.sign( //parse dữ liệu thành chuỗi token
                        {
                            id: user._id,
                            phoneNumber: user.phoneNumber,
                            isAdmin: user.isAdmin,
                            isEmployee: user.isEmployee,
                            isUser: user.isUser,
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
                            status: user.status,
                            note: user.note
                        },
                        config.JWT_KEY, {
                            expiresIn: config.TIME_EXPIRES
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
        .select('_id phoneNumber isAdmin isEmployee isUser messages subscribes created_at updated_at name address avatar facebook email gender status note')
        .exec()
        .then(users => {
            const response = {
                count: users.length,
                users: users.map(user => {
                    return {
                        id: user._id,
                        phoneNumber: user.phoneNumber,
                        // permission: user.permission,
                        isAdmin: user.isAdmin,
                        isEmployee: user.isEmployee,
                        isUser: user.isUser,
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
                        status: user.status,
                        note: user.note,
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
    const id = req.params.userId;
    User.findById(id)
        .select('_id phoneNumber isAdmin isEmployee isUser messages subscribes created_at updated_at name address avatar facebook email status gender note')
        .populate('messages', '_id userSell userBuy post contentChatUserBuy contentChatUserSell created_at updated_at')
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
        updateOps[ops.propName] = ops.value == '' ? undefined : ops.value;
    }

    //check permission if update permission
    if (updateOps.isAdmin !== undefined || updateOps.isEmployee !== undefined || updateOps.isUser !== undefined) {
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

    const userId = req.params.userId;
    User.findById(userId)
        .select('avatar')
        .exec()
        .then(result => {
            if (result.avatar !== undefined && result.avatar !== null) {
                fs.unlink(result.avatar, (err) => {
                    if (err) throw err;
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
        })
        .catch(err => {
            res.status(500).json({
                error: 'No valid entry found for provided ID'
            });
        });
}

exports.user_update_avatar = (req, res) => {
    const pathImage = 'uploads/users/';

    const id = req.params.userId;
    User.findById(id)
        .select('avatar')
        .exec()
        .then(result => {
            if (result.avatar !== undefined && result.avatar !== null) {
                fs.unlink(result.avatar, (err) => {
                    if (err) {
                        res.status(500).json({
                            message: 'You don\'t have avatar'
                        });
                    }
                });
            }
            if (req.body.avatar !== undefined && req.body.avatar !== null) {
                saveImage(pathImage, req.body.avatar)
                    .then(infoImage => {
                        User.updateOne({
                                _id: id
                            }, {
                                $set: {
                                    "avatar": pathImage + infoImage.fileName + '.' + infoImage.typeImage
                                    // req.body.avatar !== undefined ? req.file.path : undefined
                                }
                            })
                            .exec()
                            .then(result => {
                                res.status(200).json({
                                    message: 'Users avatar updated',
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
                        User.updateOne({
                                _id: id
                            }, {
                                $set: {
                                    "avatar": undefined
                                }
                            })
                            .exec()
                            .then(result => {
                                res.status(422).json({
                                    error: err
                                });
                            })
                            .catch(err => {
                                res.status(500).json({
                                    message: 'No valid entry found for provided ID',
                                    error: err
                                });
                            });
                    });
            } else {
                User.updateOne({
                        _id: id
                    }, {
                        $set: {
                            "avatar": undefined
                        }
                    })
                    .exec()
                    .then(result => {
                        res.status(404).json({
                            error: 'Not found image'
                        });
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

exports.user_update_subscribe = (req, res) => {
    const id = req.params.userId;
    User.findById(id)
        .select('subscribes')
        .exec()
        .then(user => {
            console.log(user);
            if (req.body.postId !== undefined && req.body.postId !== null) {
                const postId = req.body.postId;
                Post.findById(postId)
                    .then(post => {
                        console.log(post);
                        let result = user.subscribes.findIndex(postId => postId.toString() === post._id.toString());
                        console.log(result);
                        if (result == -1) {
                            user.subscribes.push(post._id);
                            user.save(() => {
                                res.status(200).json({
                                    message: 'Subscribe success',
                                });
                            });
                        } else {
                            user.subscribes.pull(post._id);
                            user.save(() => {
                                res.status(200).json({
                                    message: 'Unsubscribe success',
                                });
                            });
                        }
                    })
                    .catch(err => {
                        res.status(500).json({
                            message: 'No valid entry found for provided post ID',
                            error: err
                        });
                    });
            } else {
                res.status(404).json({
                    message: 'Not found post ID'
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                message: 'No valid entry found for provided user ID',
                error: err
            });
        });
}

exports.users_get_subscribes = (req, res) => {
    const id = req.params.userId;
    User.findById(id)
        .select('subscribes')
        .exec()
        .then(user => {
            let listSubscribes = [];
            user.subscribes.map(subscribe => {
                listSubscribes.push(mongoose.Types.ObjectId(subscribe));
            });

            Post.find({
                    _id: {
                        $in: listSubscribes
                    }
                })
                .select('_id classify category title price city images updated_at')
                .populate('category', 'title')
                .populate('classify', 'title')
                .sort({
                    updated_at: -1
                })
                .populate('city', 'name')
                .exec()
                .then(listPosts => {
                    console.log(listPosts);
                    const response = {
                        count: listPosts.length,
                        subscribes: listPosts.map(post => {
                            return {
                                id: post._id,
                                classify: post.classify,
                                category: post.category,
                                title: post.title,
                                price: post.price,
                                city: post.city,
                                images: post.images,
                                updatedAt: post.updated_at,
                                moment: moment(post.updated_at, 'YYYYMMDD').fromNow()
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
        })
        .catch(err => {
            res.status(500).json({
                message: 'No valid entry found for provided user ID',
                error: err
            });
        });
}

function checkPermission(tokenEncoded) {
    return new Promise(resolve => {
        const decoded = jwt.verify(tokenEncoded, config.JWT_KEY);
        if (decoded.isAdmin) {
            resolve(1);
        } else {
            resolve(0);
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

function updateAvatarUser(id, pathAvatar) {

}