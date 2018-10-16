const express = require('express');
const app = express();
const { handler } = require('./util/errors');


app.use(express.static('public'));
app.use(express.json());

const tours = require('./routes/tours');

app.use('/api/tours', tours);
app.use(handler);

module.exports = app;
