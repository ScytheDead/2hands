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

exports.producer_get_all = (req, res) => {
    res.render('module/admin/producer/all_producer', { layout: 'default' });
}

exports.get_producer = (req, res) => {
    var idProducer = req.params.producerId;
    res.render('module/admin/producer/add_or_edit_producer', { layout: 'default', producerId: idProducer });
}

exports.create_producer = (req, res) => {
    res.render('module/admin/producer/add_or_edit_producer', { layout: 'default' });
}