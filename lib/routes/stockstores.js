const express = require('express');
const router = express.Router();
const stockStore = require('../models/stockstore');
const bodyParser = require('body-parser').json();

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
    .post('/', bodyParser, (req, res, next) => {
        new stockStore().save()
            .then(store => {
                res.send(store);
            })
            .catch(next);
    });

module.exports = router;