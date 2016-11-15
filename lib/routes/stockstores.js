const express = require('express');
const router = express.Router();
const stockStore = require('../models/stockstore');
const bodyParser = require('body-parser').json();
const ensureAuth = require('../auth/ensure-auth')();
const ensureRole = require('../auth/ensure-role');

//a way to store all unique stocks that we have
//every time we have a new stock added, check if it exists in our stock store
// so that we can make one api call
    // and we can use this to calculate everyone's net portfolio value.

router

    .get('/', bodyParser, (req, res, next) => {
        stockStore
            .find()
            .then(stockstore => {
                res.send(stockstore);
            })
            .catch(next);
    })

    .put('/:id', bodyParser, (req, res, next) => {
        const newStock = req.params.id.toUpperCase();
        stockStore
            .findOne() //assumes there will be no changes!
            .then(store => {
                store.updateStocks(newStock);
                store.markModified('stocks');
                return store.save();
            })
            .then(store => {
                res.send(store);
            })
            .catch(next);
    })
    //should only be used once and only with admin level permission!!!
    .post('/', ensureAuth, ensureRole(['admin']), bodyParser, (req, res, next) => {
        new stockStore().save()
            .then(store => {
                res.send(store);
            })
            .catch(next);
    });

module.exports = router;
