const request = require('supertest');
const app = require('../../lib/app');
const { dropCollection } = require('./db');

describe('tours', () => {

    let tours = [
        { 
            title: 'Fun fun fun!',
            activities: ['fun', 'more fun', 'even more fun'],
            launchDate: new Date('2018-09-11T18:37:49.647Z')
        },
        { 
            title: 'Animal Friendly Circus',
            activities: ['person-taming', 'vegan cotton candy eating', 'anti-petting zoo'],
            launchDate: new Date('2018-08-11T18:37:49.647Z')
        }
    ];

    let createdTours; 

    const createTour = tour => {
        return request(app)
            .post('/api/tours')
            .send(tour)
            .then(res => res.body);
    };

    const createStop = tour => {
        return request(app)
            .post(`/api/tours/${tour._id}/stops`)
            .send({ zip: 97034 })
            .then(res => res.body);
    };

    beforeEach(() => {
        return dropCollection('tours');
    });

    beforeEach(() => {
        return Promise.all(tours.map(createTour)).then(toursRes => {
            createdTours = toursRes;
        });
    });

    beforeEach(() => {
        return Promise.all(createdTours.map(createStop)).then(stopsRes => {
            createdTours = stopsRes;
        });
    });


    it('creates a tour on post', () => {
        return request(app)
            .post('/api/tours')
            .send({ 
                title: 'Big Top Extravaganza!',
                activities: ['fire dancing', 'tight-rope walking', 'elephant taming'],
                launchDate: '2018-10-11T18:37:49.647Z'
            })
            .then(res => {
                expect(res.body).toEqual({
                    __v: expect.any(Number),
                    _id: expect.any(String), 
                    title: 'Big Top Extravaganza!',
                    activities: ['fire dancing', 'tight-rope walking', 'elephant taming'],
                    launchDate: '2018-10-11T18:37:49.647Z',
                    stops: []
                });
            });
    });

    it('retrieve all tours on get request', () => {
        return request(app)
            .get('/api/tours')
            .then(retrievedTours => {
                createdTours.forEach(createdTour => {
                    expect(retrievedTours.body).toContainEqual(createdTour);
                });
            });
    });

    it('retrieves a specific tour on get request with an id', () => {
        return request(app)
            .get(`/api/tours/${createdTours[1]._id}`)
            .then(res => {
                expect(res.body).toEqual(createdTours[1]);
            });
    });

    it('deletes a tour when passed an id', () => {
        return request(app)
            .delete(`/api/tours/${createdTours[1]._id}`)
            .then(res => {
                expect(res.body).toEqual({ removed: true });
            });
    });

    it('deletes a stop when passed a tourId and stopId', () => {
        const tourId = createdTours[1]._id;
        const stopId = createdTours[1].stops[0]._id; 
        return request(app)
            .delete(`/api/tours/${tourId}/stops/${stopId}`)
            .then(newTour => {
                expect(newTour.body.stops).toEqual([]);
            });
    });

    it('posts a new stop to a tour', () => {
        return request(app)
            .post(`/api/tours/${createdTours[1]._id}/stops`)
            .send({ zip: '97209' })
            .then(res => {
                expect(res.body.stops[1].location.city).toEqual('Portland');
                expect(res.body.stops[1].weather.temperature).toEqual(expect.any(String));

            });
    });

    it('updates attendance of a stop on a tour', () => {
        const tourId = createdTours[1]._id;
        const stopId = createdTours[1].stops[0]._id; 
        return request(app)
            .post(`/api/tours/${tourId}/stops/${stopId}/attendance`)
            .send({ attendance: 75 })
            .then(res => {
                expect(res.body.stops[0].attendance).toEqual(75);
            });
    });

    it('sends an error if provided incorrect tour id', () => {
        const tourId = 123456789012345678901234;
        const stopId = 123456789012345678901234; 
        return request(app)
            .post(`/api/tours/${tourId}/stops/${stopId}/attendance`)
            .send({ attendance: 75 })
            .then(res => {
                expect(res.status).toEqual(400);
            });
    });
    
});


