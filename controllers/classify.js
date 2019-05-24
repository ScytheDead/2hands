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

exports.classify_get_all = (req, res) => {
    res.render('module/admin/classify/all_classify', { layout: 'default' });
}

exports.get_classify = (req, res) => {
    var idClassify = req.params.classifyId;
    res.render('module/admin/classify/add_or_edit_classify', { layout: 'default', classifyId: idClassify });
}

exports.create_classify = (req, res) => {
    res.render('module/admin/classify/add_or_edit_classify', { layout: 'default' });
}