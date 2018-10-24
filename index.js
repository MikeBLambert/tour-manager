require('dotenv').config();
require('./lib/util/connect')();
const { createServer } = require('http');
const app = require('./lib/app');
//test
const port = 9876;

const server = createServer(app);

server.listen(port, () => {
    console.log(`Listening on ${port}`);
});
