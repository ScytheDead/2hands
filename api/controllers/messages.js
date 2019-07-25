const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const config = require('../../config');
const Message = require('../models/messages');
const User = require('../models/users');
const Post = require('../models/posts');
const moment = require('moment');
moment.locale('vi');

exports.create_Message = async (req, res) => {
    const userSellId = req.body.userSellId;
    const userBuyId = req.body.userBuyId;
    const postId = req.body.postId;

    User.findById(userSellId)
        .then(userSell => {
            console.log(userSell);
            User.findById(userBuyId)
                .then(userBuy => {
                    console.log(userBuy);
                    Post.findById(postId)
                        .then(post => {
                            if (post.user.toString() === userSellId.toString()) {
                                Message.find({
                                        userSell: userSellId,
                                        userBuy: userBuyId,
                                        post: postId
                                    })
                                    .select('_id userSell userBuy post contentChatUserBuy contentChatUserSell')
                                    .populate('userSell', '_id name phoneNumber address avatar email gender created_at')
                                    .populate('userBuy', '_id name phoneNumber address avatar email gender messages created_at')
                                    .populate('post', '_id category classify title content price address city images')
                                    .exec()
                                    .then(message => {
                                        if (message.length == 0) {
                                            const messageCreate = new Message({
                                                _id: new mongoose.Types.ObjectId(),
                                                userSell: userSellId,
                                                userBuy: userBuyId,
                                                post: postId
                                            });
                                            messageCreate.save()
                                                .then(result => {
                                                    userBuy.messages.push(result._id);
                                                    userBuy.save();

                                                    res.status(201).json({
                                                        message: {
                                                            _id: result._id,
                                                            userSell: {
                                                                id: userSell._id,
                                                                name: userSell.name,
                                                                phoneNumber: userSell.phoneNumber,
                                                                address: userSell.address,
                                                                avatar: userSell.avatar,
                                                                email: userSell.email,
                                                                gender: userSell.gender,
                                                                createdAt: userSell.created_at
                                                            },
                                                            userBuy: {
                                                                id: userBuy._id,
                                                                name: userBuy.name,
                                                                phoneNumber: userBuy.phoneNumber,
                                                                address: userBuy.address,
                                                                avatar: userBuy.avatar,
                                                                email: userBuy.email,
                                                                gender: userBuy.gender,
                                                                createdAt: userBuy.created_at,
                                                                messages: userBuy.messages
                                                            },
                                                            post: {
                                                                id: post._id,
                                                                category: post.category._id,
                                                                classify: post.classify._id,
                                                                title: post.title,
                                                                content: post.content,
                                                                price: post.price,
                                                                address: post.address,
                                                                city: post.city,
                                                                createdAt: post.created_at,
                                                                updatedAt: post.updated_at,
                                                                images: post.images,
                                                                moment: moment(post.updated_at, 'YYYYMMDD').fromNow()
                                                            },
                                                            moment: moment(result.updated_at, 'YYYYMMDD').fromNow()
                                                        }
                                                    });
                                                })
                                                .catch(err => {
                                                    res.status(500).json({
                                                        error: err
                                                    });
                                                });
                                        } else {
                                            res.status(200).json({
                                                message: message[0]
                                            });
                                        }

                                    })
                                    .catch(err => {
                                        res.status(500).json({
                                            error: err
                                        });
                                    })
                            } else {
                                res.status(500).json({
                                    message: 'Post not of user sell'
                                });
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({
                                message: 'No valid entry found for provided post ID',
                                error: err
                            });
                        });
                })
                .catch(err => {
                    res.status(500).json({
                        message: 'No valid entry found for provided user buy ID',
                        error: err
                    });
                });
        })
        .catch(err => {
            res.status(500).json({
                message: 'No valid entry found for provided user sell ID',
                error: err
            });
        });
}

// exports.get_all_messages_by_user = (req, res) => {
//     const token = req.headers.authorization.split(" ")[1];
//     const user = jwt.verify(token, config.JWT_KEY);
//     console.log(user);
//     User.findById(user.id)
//     .select('_id ')
// }

exports.get_message_by_id = (req, res) => {
    const id = req.params.messageId;
    Message.findById(id)
        .select('_id userSell userBuy post contentChatUserBuy contentChatUserSell created_at updated_at')
        .populate('userSell', '_id name phoneNumber address avatar email gender messages created_at')
        .populate('userBuy', '_id name phoneNumber address avatar email gender messages created_at')
        .populate('post', '_id category classify user title content price address city images created_at updated_at')
        .exec()
        .then(message => {
            res.status(200).json({
                message: returnMessageGet(message)
            });
        })
        .catch(err => {
            console.log(err);
            res.status(404).json({
                message: 'No valid entry found for provided ID',
                error: err
            });
        })
}

exports.get_all_messages_by_user = (req, res) => {
    const userId = req.params.userId;
    User.findById(userId)
        .select('messages')
        .exec()
        .then(user => {
            console.log(user);
            Message.find({
                    '_id': {
                        $in: user.messages
                    }
                })
                .select('userSell userBuy post contentChatUserBuy contentChatUserSell created_at updated_at')
                .sort({
                    updated_at: -1
                })
                .populate('userSell', 'name phoneNumber address avatar email gender messages created_at')
                .populate('userBuy', 'name phoneNumber address avatar email gender messages created_at')
                .populate('post', 'category classify user title content price address city images created_at updated_at')
                .exec()
                .then(listMessages => {
                    const syncIdMessageUser_Message = listMessages.map(message => {
                        return message._id;
                    });
                    user.messages = syncIdMessageUser_Message;
                    user.save();
                    
                    const response = {
                        count: listMessages.length,
                        messages: listMessages.map(message => {
                            return returnMessageGet(message);
                        })
                    }
                    res.status(200).json(response);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
        })
        .catch(err => {

            res.status(404).json({
                message: 'No valid entry found for provided ID',
                error: err
            });
        });
}

function returnMessageGet(message) {
    var response = {
        _id: message._id,
        post: {
            _id: message.post._id,
            user: message.post.user,
            category: message.post.category._id,
            classify: message.post.classify == undefined ? undefined : message.post.classify._id,
            title: message.post.title,
            content: message.post.content,
            price: message.post.price,
            address: message.post.address,
            city: message.post.city,
            createdAt: message.post.created_at,
            updatedAt: message.post.updated_at,
            images: message.post.images,
            moment: moment(message.post.updated_at, 'YYYYMMDD').fromNow()
        },
        userSell: {
            _id: message.userSell._id,
            name: message.userSell.name,
            phoneNumber: message.userSell.phoneNumber,
            address: message.userSell.address,
            avatar: message.userSell.avatar,
            email: message.userSell.email,
            gender: message.userSell.gender,
            createdAt: message.userSell.created_at,
            messages: message.userSell.messages
        },
        userBuy: {
            _id: message.userBuy._id,
            name: message.userBuy.name,
            phoneNumber: message.userBuy.phoneNumber,
            address: message.userBuy.address,
            avatar: message.userBuy.avatar,
            email: message.userBuy.email,
            gender: message.userBuy.gender,
            createdAt: message.userBuy.created_at,
            messages: message.userBuy.messages
        },
        contentChatUserBuy: message.contentChatUserBuy,
        contentChatUserSell: message.contentChatUserSell,
        createdAt: message.created_at,
        updatedAt: message.updated_at,
        moment: moment(message.updated_at, 'YYYYMMDD').fromNow()
    };

    return response;
}