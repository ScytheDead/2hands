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

exports.categories_get_all_index = (req, res) => {
    // Make the HTTP request
    request(`${config.API_ADDRESS}/api/categories`, function (error, response, body) {
        // console.log('error:', error); // Print the error if one occurred
        // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        // console.log('body:', body); // Print the HTML for the Google homepage.
        res.render('index', {layout: 'default', body: JSON.parse(body)});
    });
}

exports.categories_get_all = (req, res) => {
    // Make the HTTP request
    request(`${config.API_ADDRESS}/api/categories`, function (error, response, body) {
        res.render('module/admin/category/all_category', {layout: 'default', body: JSON.parse(body)});
    });
}

exports.get_category = (req, res) => {
    var idCategory = req.params.categoryId;
    res.render('module/admin/category/add_or_edit_category', { layout: 'default', categoryId: idCategory });
}

exports.create_category = (req, res) => {
    res.render('module/admin/category/add_or_edit_category', { layout: 'default' });
}
