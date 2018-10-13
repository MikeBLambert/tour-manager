const router = require('express').Router();
const Tour = require('../models/Tour');
const createLocationWeather = require('../util/location');

module.exports = router
    .post('/', (req, res, next) => {
        const { title, activities, launchDate } = req.body;
        // const { location, weather, attendance } = stops;
        Tour.create({ title, activities, launchDate })
            .then(tour => {
                res.json(tour);
            })
            .catch(next);
    })
    
    .post('/:id/stops', createLocationWeather(), (req, res, next) => {
        const { id } = req.params;
        Tour.findByIdAndUpdate(
            id, 
            { $push: { stops: req.locationResult } }, 
            { new: true }
        )
            .then(tour => res.json(tour))
            .catch(next);
    })

    .post('/:tourId/stops/:stopId/attendance', (req, res, next) => {
        const { tourId, stopId } = req.params;
        const { attendance } = req.body;
        Tour.findOneAndUpdate(
            { '_id': tourId, 'stops._id': stopId }, 
            { $set: { 'stops.$.attendance': attendance } }, 
            { new: true }
        )
            .then(result => res.json(result))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Tour.find()
            .then(tours => res.json(tours))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        const { id } = req.params;
        Tour.findById(id)
            .then(tour => res.json(tour))
            .catch(next);
    })

    .delete('/:id', (req, res, next) => {
        const { id } = req.params;
        Tour.deleteOne({ _id: id })
            .then(result => { return { removed: (result.ok > 0) };
            })
            .then(result => res.json(result))
            .catch(next);
    })

    .delete('/:tourId/stops/:stopId', (req, res, next) => {
        const { tourId, stopId } = req.params;
        Tour.findOneAndUpdate(
            { _id: tourId }, 
            { $pull: { stops: { _id: stopId } } }, 
            { new: true }
        )
            .then(result => res.json(result))
            .catch(next);
    });

