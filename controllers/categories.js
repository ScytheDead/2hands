var request = require('request');
const express = require('express');
const app = express();
const config = require('../config');

// View engine setup
app.set('view engine', 'ejs');
app.set('views', './views');

exports.categories_get_all = (req, res) => {
    // Make the HTTP request
    request(`${config.API_ADDRESS}/api/categories`, function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.
        res.render('test', {body: JSON.parse(body)});
    });
}