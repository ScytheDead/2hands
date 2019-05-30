const http = require('http');
const app = require('./app');
const Post = require('./api/models/posts');

const port = process.env.PORT || 3000;

const server = http.createServer(app);

const io = require('socket.io')(server);

server.listen(port);

io.on('connection', socket => {

    console.log("Co nguoi ket noi:" + socket.id);

    Post.find({status: 0})
    .select('_id user producer classify category title content price images seller priority status note created_at updated_at')
    .populate('producer', 'title')
    .populate('classify', 'title')
    .populate('category', 'title')
    .exec()
    .then(posts => {
        console.log(posts)
        socket.emit("server-send-list-post-waiting", posts);
    })

    socket.on('client-send-data', data => {
        console.log(data);
    });



    
    socket.on('disconnect', () => {
        /* … */
    });
});