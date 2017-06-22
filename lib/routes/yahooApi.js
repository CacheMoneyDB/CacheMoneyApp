const express = require('express');
const router = express.Router();
const yahooFinance = require('yahoo-finance');
const bodyParser = require('body-parser').json();
const url = require('url');
const qs = require('querystring');
// TitleCase for models
const stockstore = require('../models/stockstore');
const portfolio = require('../models/portfolio');

// move constants out to top-level of module
const fields = [ 'n', 's', 'a', 'g', 'h', 'y', 'd', 'r', 'b4', 'e', 'j4', 'r6', 's7' ] // s is symbol, a is ask price

// this maybe could live on stockstore, ie Stockstore.getValueMap()
function getValueMap() {
    return stockstore
        .find()
        .then(stocks => {
            const symbols = Object.keys(stocks[0].stocks);
            return yahooFinance.snapshot({symbols, fields});
        })
        .then(snapshots => {
            const stockValueMap = snapshots.reduce((map, snapshot) => {
                map[snapshot.symbol] = snapshot.ask;
                return map;
            }, {});
            return stockValueMap;
        });
}

router
    .get('/dailyUpdate', (req, res, next) => {
        Promise
            .all([getValueMap(), portfolio.find()])
            .then(([stockValueMap, portfolios]) => {
                return portfolios.map(portfolio => {
                    const stocks = portfolio.stocks;
                    const symbols = Object.keys(portfolio.stocks);

                    const stockValue = symbols.reduce((value, symbol) => {
                        return value+= (stockValueMap[keys] * stocks[keys]);
                    }, 0);

                    portfolio.stockValue = stockValue;
                    portfolio.netCalc();
                    return portfolio.save();

                    // not how we do things with promises :(
                    // if(index === portfolios.length -1) res.send({ message: 'updated portfolios completely'});
                });

                // next step would be to move above logic onto portfolio model, 
                // router code would then look like:
                // return portfolios.map(p => p.updateValue(stockValueMap));
            })
            .then(saves => Promise.all(saves))
            .then(saved => {
                res.send({ message: `updated ${saved.length} portfolios`});
            })
            .catch(next);
    })

    .get('/', bodyParser, (req, res, next) => {
        // express already does this for you:
        const stocks = req.query.stocks;
        const stockSplit = stocks.split(',');
        const daysAgo = 90;
        const currDate = new Date();
        const toDate = currDate.toISOString().match(/\d+\-\d+\-\d+/)[0];
        const fromDate = new Date(currDate.setDate(currDate.getDate() - daysAgo)).toISOString().match(/\d+\-\d+\-\d+/)[0];
        //should look up the snapshot data but only return historical for the first stock
        Promise.all([
            yahooFinance.snapshot({
                symbols: stockSplit,
                fields
            }),
            yahooFinance.historical({
                symbol: stockSplit[0],
                from: fromDate,
                to: toDate,
                period: 'd'
            })
        ])
        .then(([snapshot,historical]) => {
            res.send({snapshot, historical});
        })
        .catch(next);
    });

module.exports = router;
