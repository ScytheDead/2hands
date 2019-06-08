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

exports.create_post = (req, res) => {
    res.render('module/post/create_or_edit_post', {layout: 'default'});
}

exports.view_posts_by_category = (req, res) => {
    let categoryId = req.params.categoryId;
    res.render('module/post/posts', {layout: 'template', categoryId: categoryId });
}


