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
        socket.room = 'Admin';
    });
    
    // load real-time create post 
    socket.on('client-create-post', post => {
        io.sockets.in('Admin').emit('server-send-create-post', post);
    });

    socket.on('client-join-room-chat', data => {
        console.log(data);
        console.log('socket room: ' + data.messageId);
        socket.join(data.messageId);
        socket.room = data.messageId;

        if (data.flag) {
            Message.findById(socket.room)
                .select('_id userSell userBuy post contentChatUserBuy contentChatUserSell')
                .populate('userSell', 'phoneNumber name avatar address city')
                .populate('userBuy', 'phoneNumber name avatar address city')
                .exec()
                .then(message => {
                    if (data.userId.toString() === message.userBuy._id.toString()) {
                        socket.emit('server-response-client-join-room-chat', {
                            nameLeft: message.userSell.name === undefined ? message.userSell.phoneNumber : message.userSell.name,
                            messageLeft: message.contentChatUserSell,
                            avatarLeft: message.userSell.avatar,

                            nameRight: message.userBuy.name === undefined ? message.userBuy.phoneNumber : message.userBuy.name,
                            messageRight: message.contentChatUserBuy,
                            avatarRight: message.userBuy.avatar
                        });
                    } else {
                        socket.emit('server-response-client-join-room-chat', {
                            nameLeft: message.userBuy.name === undefined ? message.userBuy.phoneNumber : message.userBuy.name,
                            messageLeft: message.contentChatUserBuy,
                            avatarLeft: message.userBuy.avatar,

                            nameRight: message.userSell.name === undefined ? message.userSell.phoneNumber : message.userSell.name,
                            messageRight: message.contentChatUserSell,
                            avatarRight: message.userSell.avatar,
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        }
    });

    socket.on('client-send-message', userAndContentMessage => {
        console.log(userAndContentMessage);
        let userId = userAndContentMessage.user;
        let messageChat = userAndContentMessage.messageChat;
        let messageId = userAndContentMessage.messageId;

        let messageChatAndNameUser;

        Message.findById(messageId)
            .then(message => {
                User.findById(message.userSell)
                    .then(userSell => {
                        console.log(userSell);
                        User.findById(message.userBuy)
                            .then(userBuy => {
                                let result1 = userSell.messages.find(message => message.toString() === socket.room.toString());
                                let result2 = userBuy.messages.find(message => message.toString() === socket.room.toString());
                                //undefined or message id
                                if (result1 === undefined) {
                                    userSell.messages.push(socket.room);
                                    userSell.save();
                                } else if (result2 === undefined) {
                                    userBuy.messages.push(socket.room);
                                    userBuy.save();
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
                                    io.sockets.in(messageId).emit('server-send-message-push-notification', messageChatAndNameUser);
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
    });

    socket.on('disconnect', () => {
        /* … */
        console.log("Co người ngắt ket noi:" + socket.id);
    });
});