const express = require('express');
const router = express.Router();
const yahooFinance = require('yahoo-finance');
const bodyParser = require('body-parser').json();
const url = require('url');
const qs = require('querystring');
const stockstore = require('../models/stockstore');

router

    .get('/', bodyParser, (req, res, next) => {
        const stocks = qs.parse(url.parse(req.url).query).stocks;
        const stockSplit = stocks.split(',');
        yahooFinance.snapshot({
            symbols: stockSplit,
            fields: [ 'n', 's', 'a', 'g', 'h', 'y', 'd', 'r', 'b4', 'e', 'j4', 'r6', 's7' ] // s is symbol, a is ask price
        })
        .then(snapshot => res.send(snapshot))
        .catch(next);
    })

    .get('/dailyUpdate', bodyParser, (req, res, next) => {
        const stockValueMap = {};
        stockstore.find()
          .then(stocks => {
              const stockTickers = Object.keys(stocks[0].stocks);
              yahooFinance.snapshot({
                  symbols: stockTickers,
                  fields: [ 'n', 's', 'a', 'g', 'h', 'y', 'd', 'r', 'b4', 'e', 'j4', 'r6', 's7' ] // s is symbol, a is ask price
              })
              .then(snapshot =>
                snapshot.forEach(snapshot => {
                    stockValueMap[snapshot.symbol] = snapshot.ask;
                })
                portfolio.find()
                  .then(portfolios => {})
              );

          });

    });

module.exports = router;
