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
    res.render('module/post/create_post', {layout: 'template'});
}

exports.view_posts_by_category = (req, res) => {
    const categoryId = req.params.categoryId;
    res.render('module/post/posts', {layout: 'template', categoryId: categoryId });
}

exports.post_detail = (req, res) => {
    const postId = req.params.postId;
    res.render('module/post/post_detail', {layout: 'template', postId: postId });
}

exports.post_detail_manage = (req, res) => {
    const param = req.params.postId;
    const postId = param.split('_')[1];
    const kindPost = param.split('_')[0];
    res.render('module/admin/post/detail_post', { layout: 'default', postId: postId, kindPost: kindPost });
}

exports.post_edit = (req, res) => {
    const postId = req.params.postId;
    res.render('module/post/update_post', {layout: 'template', postId: postId });
}

exports.show_manage_posts = (req, res) => {
    res.render('module/post/manage_post', {layout: 'template' });
}

exports.show_subscribes_posts = (req, res) => {
    res.render('module/post/post_subscribes', {layout: 'template' });
}

exports.show_posts_search = (req, res) => {
    res.render('module/post/post_search', {layout: 'template' });
}


