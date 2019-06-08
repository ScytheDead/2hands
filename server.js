const http = require('http');
const app = require('./app');
const Post = require('./api/models/posts');

const port = process.env.PORT || 3000;

const server = http.createServer(app);

const io = require('socket.io')(server);

server.listen(port);

io.on('connection', socket => {

    console.log("Co nguoi ket noi:" + socket.id);

    socket.on('admin-join-room', () => {
        socket.join('Admin');
        socket.room = 'Admin';

        Post.find({
                status: 0
            })
            .select('_id user producer classify category title content price address images seller priority status note created_at updated_at')
            .populate('producer', 'title')
            .populate('classify', 'title')
            .populate('category', 'title')
            .exec()
            .then(posts => {
                socket.emit("server-send-list-post-waiting", posts);
            })
    });

    socket.on('client-create-post', post => {
        io.sockets.in('Admin').emit('server-send-create-post', post)
    });




    socket.on('disconnect', () => {
        /* … */
    });
});