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
        stockstore
            .find()
            .then(stocks => {
                const stockTickers = Object.keys(stocks[0].stocks);
                return yahooFinance.snapshot({
                    symbols: stockTickers,
                    fields: [ 'n', 's', 'a', 'g', 'h', 'y', 'd', 'r', 'b4', 'e', 'j4', 'r6', 's7' ] // s is symbol, a is ask price
                });
            })
            .then(snapshots => {
                snapshots.forEach(snapshot => {
                    stockValueMap[snapshot.symbol] = snapshot.ask;
                });
                return portfolio.find();
            })
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
    })

    //TODO: figure out if this API call should get both historical and snapshot
    //or just one...if two, more front end ajax calls will be needed... 
    .get('/', bodyParser, (req, res, next) => {
        const stocks = qs.parse(url.parse(req.url).query).stocks;
        const stockSplit = stocks.split(',');
        const daysAgo = 90;
        const currDate = new Date();
        const toDate = currDate.toISOString().match(/\d+\-\d+\-\d+/)[0];
        const fromDate = new Date(currDate.setDate(currDate.getDate() - daysAgo)).toISOString().match(/\d+\-\d+\-\d+/)[0];
        //should look up the snapshot data but only return historical for the first stock
        Promise.all([
            yahooFinance.snapshot({
                symbols: stockSplit,
                fields: [ 'n', 's', 'a', 'g', 'h', 'y', 'd', 'r', 'b4', 'e', 'j4', 'r6', 's7' ] // s is symbol, a is ask price
            }),
            yahooFinance.historical({
                symbol: stockSplit[0],
                from: fromDate,
                to: toDate,
                period: 'd'
            })
        ])
        .then(([snapshot,historical]) => res.send({snapshot, historical}))
        .catch(next);
    });

module.exports = router;