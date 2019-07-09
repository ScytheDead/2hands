const express = require('express');
const hbs = require('express-handlebars');
const app = express();


// View engine setup
app.set('view engine', 'hbs');
app.engine('hbs', hbs({
    extname: 'hbs',
    defaultView: 'default',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/'
}));

exports.message = (req, res) => {
    let postId = req.params.postId;
    res.render('module/message/chat', {layout: 'template', postId: postId});
}

