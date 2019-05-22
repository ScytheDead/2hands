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

exports.show_page_admin = (req, res) => {    
    res.render('module/admin/index', {layout: 'default'});
}

exports.get_user = (req, res) => {
    var param = req.params.param.split('0301');
    var idUser = param[0];
    var token = param[1];
    request({
        url: `${config.API_ADDRESS}/api/users/${idUser}`,
        headers: {
            'Authorization': `huydeptrai ${token}`
        }
    }, (error, response, body) => {
        // console.log('error:', error); // Print the error if one occurred
        // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log(body);
        console.log(JSON.parse(body)); // Print the HTML for the Google homepage.
        res.render('module/admin/user/add_or_edit_user', {layout: 'default', body: JSON.parse(body)});
    });
}

exports.get_all_users = (req, res) => {
    res.render('module/admin/user/all_user', {layout: 'default'});
}