const express = require('express');
const app = express();
const morgan = require('morgan');
const errorHandler = require('./error-handler');
const userRoute = require('./routes/users');
const yApi = require('./routes/yahooApi');
const favicon = require('serve-favicon');

app.use(morgan('dev'));

app.use(favicon('./public/assets/favicon.ico'));


app.use('/users', userRoute);

app.use('/yapi', yApi);


app.use(express.static('../.'));

app.get('*', (req, res, next) => {
    console.log('New request:', req.url);
    res.sendFile('index.html', {root: '.'});
});

app.use(errorHandler);

module.exports = app;