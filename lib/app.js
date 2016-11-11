const express = require('express');
const app = express();
const morgan = require('morgan');
const errorHandler = require('./error-handler');

app.use(morgan('dev'));

app.use('/whatever', whatever);

function whatever(req, res, next) {
    console.log('whatever');
    next();
};

app.use(errorHandler);

module.exports = app;