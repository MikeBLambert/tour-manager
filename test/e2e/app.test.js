const request = require('supertest');
const app = require('../../lib/app');
const { dropCollection } = require('./db')

describe('tours', () => {

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
});


