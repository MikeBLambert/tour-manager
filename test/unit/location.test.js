const getLocation = require('../../lib/util/location');


describe('weather service middleware', () => {

    it('gets the temperature and location info when supplied a zip', done => {
        
        const req = { body: { zip: 97209 } };
        
        let called = false;
        let error;
        const next = err => {
            called = true;
            error = err;

            expect(called).toBeTruthy();
            expect(error).toBeUndefined();
            expect(req.locationResult).toEqual({ location: expect.any(Object), weather: expect.any(Object) });
            done();
        };

        getLocation()(req, null, next);
        
    });
});

