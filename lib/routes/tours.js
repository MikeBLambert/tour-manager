const router = require('express').Router();
const Tours = require('../models/Tours');

module.exports = router
    .post('/', (req, res) => {
        const { title, activities, launchDate } = req.body;
        // const { location, weather, attendance } = stops;
        Tours.create({ title, activities, launchDate })
            .then(tour => {
                res.json(tour);
            });
    })

    .get('/', (req, res) => {
        Tours.find().then(tours => res.json(tours));
    })

