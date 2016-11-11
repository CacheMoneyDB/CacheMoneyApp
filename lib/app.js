const express = require('express');
const app = express();
const morgan = require('morgan');
const errorHandler = require('./error-handler');
const userRoute = require('./routes/users');

app.use(morgan('dev'));

app.use('/users', userRoute);

app.use(errorHandler);

module.exports = app;