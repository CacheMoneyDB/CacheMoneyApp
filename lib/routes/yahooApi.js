const express = require('express');
const router = express.Router();
const yahooFinance = require('yahoo-finance');
const bodyParser = require('body-parser').json();
const url = require('url');
const qs = require('querystring');
const stockstore = require('../models/stockstore');
const portfolio = require('../models/portfolio');

router

    .get('/dailyUpdate', bodyParser, (req, res, next) => {
        const stockValueMap = {};
        stockstore.find()
          .then(stocks => {
              const stockTickers = Object.keys(stocks[0].stocks);
              yahooFinance.snapshot({
                  symbols: stockTickers,
                  fields: [ 'n', 's', 'a', 'g', 'h', 'y', 'd', 'r', 'b4', 'e', 'j4', 'r6', 's7' ] // s is symbol, a is ask price
              })
              .then(snapshots => {
                  snapshots.forEach(snapshot => {
                      stockValueMap[snapshot.symbol] = snapshot.ask;
                  });
                  portfolio.find()
                  .then(portfolios => {
                      portfolios.forEach((portfolio, index) => {
                          let stockValue = 0;
                          for(let keys in portfolio.stocks){ //calculates total stock value for each stock in each portfolio
                              stockValue += stockValueMap[keys] * portfolio.stocks[keys];
                          };
                          portfolio.stockValue = stockValue;
                          portfolio.netCalc();
                          portfolio.save();
                          if(index === portfolios.length -1) res.send({ message: 'updated portfolios completely'});
                      });

                  });
              });

          });
    })

    .get('/', bodyParser, (req, res, next) => {
        const stocks = qs.parse(url.parse(req.url).query).stocks;
        const stockSplit = stocks.split(',');
        yahooFinance.snapshot({
            symbols: stockSplit,
            fields: [ 'n', 's', 'a', 'g', 'h', 'y', 'd', 'r', 'b4', 'e', 'j4', 'r6', 's7' ] // s is symbol, a is ask price
        })
        .then(snapshot => res.send(snapshot))
        .catch(next);
    });

module.exports = router;
