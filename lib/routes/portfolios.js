const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser').json();
const Portfolio = require('../models/portfolio');
const stockStore = require('../models/stockstore');
const yahooFinance = require('yahoo-finance');

function adjustPortfolio(portfolio, action, cost) {
    if (action === 'buy') {
        portfolio.cashValue -= cost;
        portfolio.stockValue += cost;
    } else {
        portfolio.cashValue += cost;
        portfolio.stockValue -= cost;
    };
    portfolio.netCalc();
    portfolio.markModified('stocks');
    return portfolio;
};

// for every single person having their own unique portfolio

router

    .get('/all', bodyParser, (req, res, next) => {
        Portfolio
            .find()
            .then(portfolios => {
                res.send(portfolios);
            })
            .catch(next);
    })

    .get('/leaderboard', bodyParser, (req, res, next) => {
        Portfolio
            .aggregate([
                { $sort: { netValue: -1 } },
                { $limit: 10 },
                { $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }}
            ])
            .then(portfolios => {
                res.send(portfolios);
            })
            .catch(next);
    })

    .get('/', bodyParser, (req,res,next) => {
        const userId = req.user.id;
        let stockValueMap = {};
        let userPortfolio = {};
        let fieldValue = [ 'n', 's', 'a', 'g', 'h', 'y', 'd', 'r', 'b4', 'e', 'j4', 'r6', 's7' ];
        let stockTickers = [];
        Portfolio
            .findOne({userId})
            .then(portfolio => {
                stockTickers = Object.keys(portfolio.stocks);
                if (!stockTickers.length) {
                    portfolio.netCalc();
                    return res.send(portfolio);
                };
                userPortfolio = portfolio;
                return yahooFinance.snapshot({
                    symbols: stockTickers,
                    fields: fieldValue
                });
            })
            .then(snapshotArr => {
                if (!snapshotArr[0].ask) throw {code: 503, error: 'API request returning null for ask value'};
                snapshotArr.forEach(snapshot => {
                    stockValueMap[snapshot.symbol] = snapshot.ask;
                });
                let stockValue = 0;
                for(let keys in userPortfolio.stocks){ //calculates total stock value for each stock in each portfolio
                    stockValue += stockValueMap[keys] * userPortfolio.stocks[keys];
                };
                userPortfolio.stockValue = stockValue;
                userPortfolio.netCalc();
                return userPortfolio.save();
            })
            .then(userPortfolio => {
                res.send(userPortfolio);
            })
            .catch(next);
    })

    .put('/buy', bodyParser, (req, res, next) => {
        const {stock, shares, price} = req.body; //have object be {stock:ticker, shares:number, price:cost}?
        const userId = req.user.id;
        const cost = price * shares;

        if (!price || !stock || !shares) return next({code: 403, error: 'Invalid data submitted'});
        if (shares < 0) return next({code: 403, error: 'Invalid data submitted'});
        
        Promise.all([
            Portfolio
                .findOne({userId})
                .then(portfolio => {

                    if(cost > portfolio.cashValue) throw {code: 403, error: 'Cost of stocks exceeds the cash value in your portfolio.'};

                    if(stock in portfolio.stocks) portfolio.stocks[stock] += shares;
                    else portfolio.stocks[stock] = shares;

                    portfolio = adjustPortfolio(portfolio, 'buy', cost);
                    return portfolio.save();
                }),
            stockStore
                .findOne() //assumes there will be no changes!
                .then(store => {
                    if (!store) {
                        const newStore = new stockStore();
                        newStore.updateStocks(stock);
                        newStore.markModified('stocks');
                        return newStore.save();
                    } else {
                        store.updateStocks(stock);
                        store.markModified('stocks');
                        return store.save();
                    };
                })
        ])
        .then(([portfolio, store]) => {
            res.send(portfolio);
        })
        .catch(next);
    })

    .put('/sell', bodyParser, (req, res, next) => {
        const {stock, shares, price} = req.body;
        const userId = req.user.id;
        let cost = 0;
        let stockValueMap = {};
        let userPortfolio = {};
        let stockTickers = [];
        let fieldValue = [ 'n', 's', 'a', 'g', 'h', 'y', 'd', 'r', 'b4', 'e', 'j4', 'r6', 's7' ];
        if (!price || !stock || !shares) return next({code: 403, error: 'Invalid data submitted'});
        if (shares < 0) return next({code: 403, error: 'Invalid data submitted'});

        Portfolio
            .findOne({userId})
            .then(portfolio => {
                if(!(stock in portfolio.stocks)) throw {code: 403, error: 'You do not currently own any shares of this stock.'};
                if(shares > portfolio.stocks[stock]) throw {code: 403, error: 'You cannot sell more shares than are in your portfolio.'};
                userPortfolio = portfolio;
                stockTickers = Object.keys(portfolio.stocks);
                return yahooFinance.snapshot({
                    symbols: stockTickers,
                    fields: fieldValue
                });
            })
            .then(snapshotArr => {
                if (!snapshotArr[0].ask) throw {code: 503, error: 'API request returning null for ask value'};
                snapshotArr.forEach(snapshot => {
                    stockValueMap[snapshot.symbol] = snapshot.ask;
                });
                let stockValue = 0;
                for(let keys in userPortfolio.stocks){ //calculates total stock value for each stock in each portfolio
                    stockValue += stockValueMap[keys] * userPortfolio.stocks[keys];
                };
                userPortfolio.stockValue = stockValue;
                userPortfolio.netCalc();
                userPortfolio.stocks[stock] -= shares;

                if(userPortfolio.stocks[stock] === 0) {
                    const newPortfolio = Object.keys(userPortfolio.stocks).reduce((acc,curr) => {
                        if (curr !== stock) {
                            acc[curr] = userPortfolio.stocks[curr];
                        };
                        return acc;
                    }, Object.create(null));
                    userPortfolio.stocks = newPortfolio;
                };

                cost = shares * stockValueMap[stock];
                userPortfolio = adjustPortfolio(userPortfolio, 'sell', cost);
                userPortfolio.markModified('stocks');
                return userPortfolio.save();
            })
            .then(portfolio => {
                res.send(portfolio);
            })
            .catch(next);
    });


module.exports = router;
