const connect = require('../../lib/util/connect');
connect('mongodb://localhost:27017/circus-tour');
const mongoose = require('mongoose');

afterAll(() => {
    return mongoose.disconnect();
});

module.exports = {
    dropCollection(name) {
        return mongoose.connection.dropCollection(name)
            .catch(err => {
                if(err.codeName !== 'NamespaceNotFound') throw err;
            });
    }
};
