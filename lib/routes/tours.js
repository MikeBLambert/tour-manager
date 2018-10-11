const router = require('express').Router();
const Tours = require('../models/Tours');

module.exports = router
    .post('/', (req, res) => {
        const { title, activities, launchDate } = req.body;
        Tours.create({ title, activities, launchDate })
            .then(tour => {
                res.json(tour);
            });
    });

