const http = require('http');
const app = require('./app');
const Post = require('./api/models/posts');
const Message = require('./api/models/messages');
const User = require('./api/models/users');

const port = process.env.PORT || 3000;

const server = http.createServer(app);

const io = require('socket.io')(server);

server.listen(port);

io.on('connection', socket => {

    console.log("Co nguoi ket noi:" + socket.id);


    socket.on('admin-join-room', () => {
        socket.join('Admin');
        socket.roomAdmin = 'Admin';
    });

    // load real-time create post 
    socket.on('client-create-post', post => {
        io.sockets.in('Admin').emit('server-send-create-post', post);
    });

    socket.on('client-currently-logged', data => {
        let listMessagesId = data.listMessagesId;
        socket.room = listMessagesId;
        socket.userId = data.userId;

        if (listMessagesId != undefined) {
            listMessagesId.forEach(messageId => {
                socket.join(messageId);
                io.sockets.in(messageId).emit('online', {
                    userId: data.userId,
                    messageId: messageId
                });
            });
        }
    });

    socket.on('response-online', data => {
        if (socket.room != undefined && socket.userId != undefined) {
            let messageId = data.messageId;
            let userId = data.userId;
            io.sockets.in(messageId).emit('client-send-response-online', {
                userId: userId,
                messageId: messageId
            });
        }
    });

    socket.on('client-join-room-chat', data => {
        //console.log(data);
        console.log(socket.room);
        console.log(socket.userId);
        if (socket.room != undefined && socket.userId != undefined) {
            let room = socket.room.find(messageId => messageId == data.messageId);
            console.log(room)
            if (room != undefined) {
                Message.findById(room)
                    .select('_id userSell userBuy post contentChatUserBuy contentChatUserSell')
                    .populate('userSell', 'phoneNumber name avatar address city')
                    .populate('userBuy', 'phoneNumber name avatar address city')
                    .exec()
                    .then(message => {
                        //console.log(message)
                        if (data.userId.toString() === message.userBuy._id.toString()) {
                            socket.emit('server-response-client-join-room-chat', {
                                nameLeft: message.userSell.name === undefined ? message.userSell.phoneNumber : message.userSell.name,
                                messageLeft: message.contentChatUserSell,
                                avatarLeft: message.userSell.avatar,

                                nameRight: message.userBuy.name === undefined ? message.userBuy.phoneNumber : message.userBuy.name,
                                messageRight: message.contentChatUserBuy,
                                avatarRight: message.userBuy.avatar
                            });

                            message.contentChatUserSell.forEach(contentChat => contentChat.seen = 1);
                            message.save();
                        } else {
                            socket.emit('server-response-client-join-room-chat', {
                                nameLeft: message.userBuy.name === undefined ? message.userBuy.phoneNumber : message.userBuy.name,
                                messageLeft: message.contentChatUserBuy,
                                avatarLeft: message.userBuy.avatar,

                                nameRight: message.userSell.name === undefined ? message.userSell.phoneNumber : message.userSell.name,
                                messageRight: message.contentChatUserSell,
                                avatarRight: message.userSell.avatar,
                            });

                            message.contentChatUserBuy.forEach(contentChat => contentChat.seen = 1);
                            message.save();
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        }

    });

    socket.on('client-send-message', userAndContentMessage => {
        console.log(userAndContentMessage);

        if (socket.room != undefined && socket.userId != undefined) {
            let userId = userAndContentMessage.user;
            let messageChat = userAndContentMessage.messageChat;
            let messageId = userAndContentMessage.messageId;

            let room = socket.room.find(roomMessageId => roomMessageId == messageId);
            console.log(room)
            if (room != undefined) {
                let messageChatAndNameUser;

                Message.findById(messageId)
                    .then(message => {
                        User.findById(message.userSell)
                            .then(userSell => {
                                User.findById(message.userBuy)
                                    .then(userBuy => {
                                        let result1 = userSell.messages.find(message => message.toString() === messageId.toString());
                                        let result2 = userBuy.messages.find(message => message.toString() === messageId.toString());
                                        //undefined or message id
                                        if (result1 === undefined) {
                                            userSell.messages.push(messageId);
                                            userSell.save();
                                            socket.broadcast.emit('server-send-new-message', userSell._id);
                                        } else if (result2 === undefined) {
                                            userBuy.messages.push(messageId);
                                            userBuy.save();
                                            socket.broadcast.emit('server-send-new-message', userBuy._id);
                                        }

                                        if (message.userSell.toString() === userId.toString()) {
                                            message.contentChatUserSell.push({
                                                content: messageChat
                                            });

                                            messageChatAndNameUser = {
                                                messageId: messageId,
                                                userId: userSell._id,
                                                avatar: userSell.avatar,
                                                name: userSell.name === undefined ? userSell.phoneNumber : userSell.name,
                                                messageChat: messageChat
                                            }
                                        } else {
                                            message.contentChatUserBuy.push({
                                                content: messageChat
                                            });

                                            messageChatAndNameUser = {
                                                messageId: messageId,
                                                userId: userBuy._id,
                                                avatar: userBuy.avatar,
                                                name: userBuy.name === undefined ? userBuy.phoneNumber : userBuy.name,
                                                messageChat: messageChat
                                            }
                                        }

                                        message.save(() => {
                                            io.sockets.in(messageId).emit('server-send-message', messageChatAndNameUser);
                                        });
                                    })
                                    .catch(err => {
                                        console.log(err);
                                    });
                            })
                            .catch(err => {
                                console.log(err);
                            });
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        }
    });

    socket.on("user-typing", data => {
        console.log(data);
        if (socket.room != undefined && socket.userId != undefined) {
            let messageId = data.messageId;
            let response = {
                messageIdTyping: messageId,
                nameUserTyping: data.name,
                userIdTyping: data.userId,
                avatarUserTyping: data.avatar
            }
            io.sockets.in(messageId).emit("someone-typing", response);
        }
    });

    socket.on("user-pause-typing", data => {
        console.log(data);
        if (socket.room != undefined && socket.userId != undefined) {
            let userIdPauseTyping = data.userId;
            let messageId = data.messageId;
            let response = {
                userIdPauseTyping: userIdPauseTyping,
                messageIdPauseTyping: messageId
            }

            io.sockets.in(messageId).emit("someone-pause-typing", response);
        }
    });

    socket.on('client-offline', data => {
        console.log(data);
        if (socket.room != undefined && socket.userId != undefined) {
            let listMessagesId = data.listMessagesId;
            let userId = data.userId;

            listMessagesId.forEach(messageId => {
                io.sockets.in(messageId).emit('offline', {
                    userId: userId,
                    messageId: messageId
                });
            });
        }
    });

    socket.on('disconnect', () => {
        if (socket.room != undefined && socket.userId != undefined) {
            socket.room.forEach(messageId => {
                io.sockets.in(messageId).emit('offline', {
                    userId: socket.userId,
                    messageId: messageId
                });
            });
        }

        console.log("Co người ngắt ket noi:" + socket.id + ". Lúc: " + new Date(Date.now()));
    });
});