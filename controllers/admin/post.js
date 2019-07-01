var request = require('request');
const express = require('express');
const hbs = require('express-handlebars');
const app = express();
const config = require('../../config');

// View engine setup
app.set('view engine', 'hbs');
app.engine('hbs', hbs({
    extname: 'hbs',
    defaultView: 'default',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/'
}));

exports.post_waiting = (req, res) => {
    res.render('module/admin/post/post_waiting', { layout: 'default' });
}

exports.get_detail_post_waiting = (req, res) => {
    const idPost = req.params.postId;
    res.render('module/admin/post/detail_post', { layout: 'default', postId: idPost });
}

// exports.get_producer = (req, res) => {
//     var idProducer = req.params.producerId;
//     res.render('module/admin/producer/add_or_edit_producer', { layout: 'default', producerId: idProducer });
// }

// exports.create_producer = (req, res) => {
//     res.render('module/admin/producer/add_or_edit_producer', { layout: 'default' });
// }