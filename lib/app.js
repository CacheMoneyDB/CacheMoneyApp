const express = require('express');
const app = express();
const morgan = require('morgan');
const errorHandler = require('./error-handler');
const userRoute = require('./routes/users');
const portfolios = require('./routes/portfolios');
const yApi = require('./routes/yahooApi');
const stockStore = require('./routes/stockstores');
const ensureAuth = require('./auth/ensure-auth')();
const ensureRole = require('./auth/ensure-role');

app.use(morgan('dev'));


app.use('/users', userRoute);
app.use('/portfolios',ensureAuth, portfolios);
app.use('/stockstores', stockStore);
app.use('/yapi', yApi);

app.use(express.static('./'));

app.get('*', (req, res, next) => {
    res.sendFile('index.html', {root: '.'});
});

app.use(errorHandler);

module.exports = app;
