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

    .get('/:id', (req, res) => {
        const { id } = req.params;
        Tours.findById(id).then(tour => res.json(tour));
    })

    .delete('/:id', (req, res) => {
        const { id } = req.params;
        Tours.deleteOne({ _id: id })
            .then(result => { return { removed: (result.ok > 0) };
            })
            .then(result => res.json(result));
    });
