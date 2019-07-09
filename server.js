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

        // Post.find({
        //         status: 0
        //     })
        //     .select('_id user producer classify category title content price address images seller priority status note created_at updated_at')
        //     .populate('producer', 'title')
        //     .populate('classify', 'title')
        //     .populate('category', 'title')
        //     .exec()
        //     .then(posts => {
        //         socket.emit("server-send-list-post-waiting", posts);
        //     })
    });

    socket.on('client-create-post', post => {
        io.sockets.in('Admin').emit('server-send-create-post', post)
    });

    socket.on('client-join-room-chat', data => {
        console.log('socket room: ' + data.messageId);
        socket.join(data.messageId);
        socket.room = data.messageId;
        Message.findById(socket.room)
            .select('_id userSell userBuy post contentChatUserBuy contentChatUserSell')
            .populate('userSell', 'phoneNumber name address city')
            .populate('userBuy', 'phoneNumber name address city')
            .exec()
            .then(message => {
                // console.log(message);
                if (data.userId.toString() === message.userBuy._id.toString()) {
                    // console.log(1111111111111)
                    socket.emit('server-response-client-join-room-chat', {
                        nameLeft: message.userSell.name === undefined ? message.userSell.phoneNumber : message.userSell.name,
                        messageLeft: message.contentChatUserSell,
                        nameRight: message.userBuy.name === undefined ? message.userBuy.phoneNumber : message.userBuy.name,
                        messageRight: message.contentChatUserBuy
                    });
                } else {
                    socket.emit('server-response-client-join-room-chat', {
                        nameLeft: message.userBuy.name === undefined ? message.userBuy.phoneNumber : message.userBuy.name,
                        messageLeft: message.contentChatUserBuy,
                        nameRight: message.userSell.name === undefined ? message.userSell.phoneNumber : message.userSell.name,
                        messageRight: message.contentChatUserSell
                    });
                }
            })
            .catch(err => {
                console.log(err);
            });
    });

    socket.on('client-send-message', userAndContentMessage => {
        // console.log(userAndContentMessage);
        let userBuyId = userAndContentMessage.user;
        let messageChat = userAndContentMessage.messageChat;
        User.findById(userBuyId)
            .then(userBuy => {
                let messageChatAndNameUser = {
                    name: userBuy.name === undefined ? userBuy.phoneNumber : userBuy.name,
                    messageChat: messageChat
                }
                io.sockets.in(socket.room).emit('server-send-message', messageChatAndNameUser);
            })

        Message.findById(socket.room)
            .then(message => {
                User.findById(message.userSell)
                    .then(userSell => {
                        // console.log(userSell);
                        let result = userSell.messages.find(message => message.toString() === socket.room.toString())
                        console.log(result); //undefined or message id
                        if (result === undefined) {
                            userSell.messages.push(socket.room);
                            userSell.save();
                        }

                        if (message.userBuy.toString() === userBuyId.toString()) {
                            message.contentChatUserBuy.push({
                                content: messageChat
                            });
                        } else {
                            message.contentChatUserSell.push({
                                content: messageChat
                            });
                        }
                        message.save();
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
    });
});