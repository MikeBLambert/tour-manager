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

    beforeEach(() => {
        return dropCollection('tours');
    });

    beforeEach(() => {
        return Promise.all(tours.map(createTour)).then(toursRes => {
            createdTours = toursRes;
        });
    });

    it('creates a tour on post', () => {
        return request(app)
            .post('/api/tours')
            .send({ 
                title: 'Big Top Extravaganza!',
                activities: ['fire dancing', 'tight-rope walking', 'elephant taming'],
                launchDate: new Date('2018-10-11T18:37:49.647Z')
            })
            .then(res => {
                expect(res.body).toEqual({
                    __v: expect.any(Number),
                    _id: expect.any(String), 
                    title: 'Big Top Extravaganza!',
                    activities: ['fire dancing', 'tight-rope walking', 'elephant taming'],
                    launchDate: new Date('2018-10-11T18:37:49.647Z').toISOString(),
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
            })
    })

    
});


