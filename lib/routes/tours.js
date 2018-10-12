const router = require('express').Router();
const Tour = require('../models/Tour');
const createLocationWeather = require('../util/location')

module.exports = router
    .post('/', (req, res) => {
        const { title, activities, launchDate } = req.body;
        // const { location, weather, attendance } = stops;
        Tour.create({ title, activities, launchDate })
            .then(tour => {
                res.json(tour);
            });
    })

    .get('/', (req, res) => {
        Tour.find().then(tours => res.json(tours));
    })

    .get('/:id', (req, res) => {
        const { id } = req.params;
        Tour.findById(id).then(tour => res.json(tour));
    })

    .delete('/:id', (req, res) => {
        const { id } = req.params;
        Tour.deleteOne({ _id: id })
            .then(result => { return { removed: (result.ok > 0) };
            })
            .then(result => res.json(result));
    })

    .post('/:id/stops', createLocationWeather(), (req, res, next) => {
        const { id } = req.params;
        console.log(req.locationResult)
        Tour.findByIdAndUpdate({ _id: id }, { $push: { stops: req.locationResult } })
            .then(tour => res.json(tour));

    })
