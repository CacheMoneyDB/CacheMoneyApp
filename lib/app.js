const express = require('express');
const app = express();
const morgan = require('morgan');
const errorHandler = require('./error-handler');
const userRoute = require('./routes/users');
const yApi = require('./routes/yahooApi');

app.use(morgan('dev'));

app.use('/users', userRoute);
app.use('/yapi', yApi);

app.use(errorHandler);

module.exports = app;