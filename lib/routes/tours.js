const router = require('express').Router();
const Tour = require('../models/Tour');
const createLocationWeather = require('../util/location');

module.exports = router
    .post('/', (req, res) => {
        const { title, activities, launchDate } = req.body;
        // const { location, weather, attendance } = stops;
        Tour.create({ title, activities, launchDate })
            .then(tour => {
                res.json(tour);
            });
    })
    
    .post('/:id/stops', createLocationWeather(), (req, res, next) => {
        const { id } = req.params;
        Tour.findByIdAndUpdate(
            id, 
            { $push: { stops: req.locationResult } }, 
            { new: true }
        )
            .then(tour => res.json(tour));
    })

    .post('/:tourId/stops/:stopId/attendance', (req, res) => {
        const { tourId, stopId } = req.params;
        const { attendance } = req.body;
        Tour.findOneAndUpdate(
            { '_id': tourId, 'stops._id': stopId }, 
            { $set: { 'stops.$.attendance': attendance } }, 
            { new: true }
        )
            .then(result => res.json(result));
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

    .delete('/:tourId/stops/:stopId', (req, res) => {
        const { tourId, stopId } = req.params;
        Tour.findOneAndUpdate(
            { _id: tourId }, 
            { $pull: { stops: { _id: stopId } } }, 
            { new: true }
        )
            .then(result => res.json(result));
    });

