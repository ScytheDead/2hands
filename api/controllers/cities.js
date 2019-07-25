const City = require('../models/cities');

exports.cities_get_all = (req, res) => {
    City.find()
        .select('_id id name location type created_at updated_at')
        .exec()
        .then(cities => {
            const response = {
                count: cities.length,
                cities: cities.map(doc => {
                    return {
                        _id: doc._id,
                        id: doc.id,
                        name: doc.name,
                        location: doc.location,
                        type: doc.type,
                        createdAt: doc.created_at,
                        updatedAt: doc.updated_at,
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}

exports.cities_get_city = async (req, res) => {
    const id = req.params.cityId;
    City.findById(id)
        .select('_id id name location type created_at updated_at')
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    city: doc
                });
            } else {
                res.status(404).json({
                    message: 'No valid entry found for provided ID'
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                message: 'No valid entry found for provided ID',
                error: err
            });
        });
}

