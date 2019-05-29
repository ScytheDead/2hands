const http = require('http');
const app = require('./app');

const port = process.env.PORT || 3000;

const server = http.createServer(app);

const io = require('socket.io')(server);

io.on('connection', socket => {
    console.log("Co nguoi ket noi:" + socket.id);
    socket.on('client-send-data', data => {
        console.log(data);
        socket.emit("server-send-data", "ahihi");
    });
    socket.on('disconnect', () => {
        /* … */ });
});



server.listen(port);