const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config');
const hbs = require('express-handlebars');


// Import api
const usersRoutes = require('./api/routes/users');
const producersRoutes = require('./api/routes/producers');
// const postsRoutes = require('./api/routes/posts');
// const messagesRoutes = require('./api/routes/messages');
const classifiesRoutes = require('./api/routes/classifies');
const categoriesRoutes = require('./api/routes/categories');

// Connect MongoDB
// mongoose.connect('mongodb+srv://2hands-huy:' + process.env.MONGO_ATLAS_PW + '@2hands-xqugg.mongodb.net/2hands?retryWrites=true',{ useNewUrlParser: true });
mongoose.connect('mongodb+srv://2hands-huy:' + config.MONGO_ATLAS_PW + '@2hands-xqugg.mongodb.net/2hands?retryWrites=true',{ useNewUrlParser: true });

// View engine setup
app.set('view engine', 'hbs');
app.engine('hbs', hbs({
    extname: 'hbs',
    defaultView: 'default',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/'
}));
app.use(express.static(__dirname + '/public'));

// ImportView
const routes = require('./routes/index');
app.use('/', routes);



app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Handling CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

// Routes which should handle requests
app.use('/api/users', usersRoutes);
app.use('/api/producers', producersRoutes);
// app.use('/api/posts', postsRoutes);
// app.use('/api/messages', messagesRoutes);
app.use('/api/classifies', classifiesRoutes);
app.use('/api/categories', categoriesRoutes);

//Custom message error khi lỗi 404
app.use((req, res, next) => {   
    const error = new Error('Not found');
    error.status = 404;
    next(error);  //Callback lưu biến error
});

app.use((error, req, res, next) => {
    res.status(error.status || 500); //Lỗi 404 hay 500 đều trả về 'Not found'
    res.json({
        error: {
            message: error.message
        }
    });
});

// Handle production
if(process.env.NODE_ENV === 'production'){
    // Static folder
    app.use(express.static(__dirname + 'public'));

    // Handle SPA
    app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'));
}
module.exports = app;
