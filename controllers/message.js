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
    res.render('module/message/chat', {layout: 'template'});
}

exports.get_message = (req, res) => {
    let messageId = req.params.messageId;
    res.render('module/message/chat', {layout: 'template', messageId: messageId});
}

