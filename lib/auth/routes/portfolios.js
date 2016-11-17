const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser').json();
const Portfolio = require('../models/portfolio');
const Users = require('../models/user');
const stockStore = require('../models/stockstore');
const yahooFinance = require('yahoo-finance');

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
                { $limit: 5 },
                { $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }}
            ])
            .then(portfolios => {
                // console.log(portfolios);
                res.send(portfolios);
            })
            .catch(next);
    })

    .get('/', bodyParser, (req,res,next) => {
        const userId = req.user.id;
        let stockValueMap = {};
        let userPortfolio = {};
        Portfolio
            .findOne({userId})
            .then(portfolio => {
                const stockTickers = Object.keys(portfolio.stocks);
                if (!stockTickers.length) next({code: 403, error: 'No stocks in portfolio'});
                userPortfolio = portfolio;
                return yahooFinance.snapshot({
                    symbols: stockTickers,
                    fields: [ 'n', 's', 'a', 'g', 'h', 'y', 'd', 'r', 'b4', 'e', 'j4', 'r6', 's7' ]
                });
            })
            .then(snapshotArr => {
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

        Promise.all([
            Portfolio
                .findOne({userId})
                .then(portfolio => {
                    if(stock in portfolio.stocks) portfolio.stocks[stock] += shares;
                    else portfolio.stocks[stock] = shares;
                    
                    if(cost > portfolio.cashValue) next({code: 403, error: 'cost of stocks exceeds cashvalue in portfolio'});

                    portfolio.cashValue -= (cost);
                    portfolio.stockValue += (cost);
                    
                    portfolio.netCalc();
                    portfolio.markModified('stocks');
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
        const cost = price * shares;
        Portfolio
            .findOne({userId})
            .then(portfolio => {
                if(!(stock in portfolio.stocks)) next({code: 403, error: 'user currently does not own this stock'});
                portfolio.stocks[stock] -= shares;

                if(portfolio.stocks[stock] <= 0) delete portfolio.stocks[stock];

                portfolio.cashValue += (cost);
                portfolio.stockValue -= (cost);
                portfolio.netCalc();
                portfolio.markModified('stocks');
                return portfolio.save();
            })
            .then(portfolio => {
                res.send(portfolio);
            })
            .catch(next);
    });


module.exports = router;