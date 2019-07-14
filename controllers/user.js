var request = require('request');
const express = require('express');
const hbs = require('express-handlebars');
const app = express();
const config = require('../config');

// View engine setup
app.set('view engine', 'hbs');
app.engine('hbs', hbs({
    extname: 'hbs',
    defaultView: 'default',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/'
}));

exports.detail_user = (req, res) => {
    res.render('module/user/view_edit_user', {layout: 'template'});
}



