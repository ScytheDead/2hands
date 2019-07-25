const express = require('express');
const router = express.Router();

const CityController = require('../controllers/cities');

router.get('/', CityController.cities_get_all);

router.get('/:cityId', CityController.cities_get_city);

module.exports = router;