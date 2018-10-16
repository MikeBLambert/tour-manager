const getLocationWeather = require('./weather-service');
const { HttpError } = require('./errors');

module.exports = (api = getLocationWeather) => {
    return (req, res, next) => {
        const { zip } = req.body;

        if(zip) {
            api(zip)
                .then(locationInfo => {
                    req.locationResult = locationInfo;
                    next();
                })
                .catch(next);   
        } else {
            const httpError = new HttpError({
                code: 404,
                message: 'Zip Not Found'
            });
            next(httpError);
        }
    };
};





