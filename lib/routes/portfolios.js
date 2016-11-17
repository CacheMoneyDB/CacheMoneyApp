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
        let fieldValue = [ 'n', 's', 'a', 'g', 'h', 'y', 'd', 'r', 'b4', 'e', 'j4', 'r6', 's7' ];
        let stockTickers = [];
        Portfolio
            .findOne({userId})
            .then(portfolio => {
                stockTickers = Object.keys(portfolio.stocks);
                if (!stockTickers.length) throw {code: 403, error: 'No stocks in portfolio'};
                userPortfolio = portfolio;
                return yahooFinance.snapshot({
                    symbols: stockTickers,
                    fields: fieldValue
                });
            })
            .then(snapshotArr => {
                if (snapshotArr.ask) {
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
                } else {
                    const currDate = new Date();
                    const toDate = currDate.toISOString().match(/\d+\-\d+\-\d+/)[0];
                    const fromDate = new Date(currDate.setDate(currDate.getDate() - 1)).toISOString().match(/\d+\-\d+\-\d+/)[0];
                    return new Promise((resolve, reject) => {
                        stockTickers.forEach(function(ticker) {
                            yahooFinance.historical({
                                symbol: ticker,
                                from: fromDate,
                                to: toDate,
                                period: 'd'
                            }, (err, quotes) => {
                                if (err) reject(err);
                                stockValueMap[quotes[0].symbol] = quotes[0].close;
                                if (Object.keys(stockValueMap).length === stockTickers.length) {
                                    let stockValue = 0;
                                    for(let keys in userPortfolio.stocks){ //calculates total stock value for each stock in each portfolio
                                        stockValue += stockValueMap[keys] * userPortfolio.stocks[keys];
                                    };
                                    userPortfolio.stockValue = stockValue;
                                    userPortfolio.netCalc();
                                    userPortfolio.save((err, portfolio) => {
                                        if (err) reject(err);
                                        resolve(portfolio);
                                    });
                                };
                            });
                        });
                    });
                };
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

        Promise.all([
            Portfolio
                .findOne({userId})
                .then(portfolio => {

                    if(cost > portfolio.cashValue) throw {code: 403, error: 'cost of stocks exceeds cashvalue in portfolio'};
                    
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
            // console.log(store);
            res.send(portfolio);
        })
        .catch(next);
    })

    .put('/sell', bodyParser, (req, res, next) => {
        const {stock, shares, price} = req.body;
        const userId = req.user.id;
        const cost = price * shares;

        if (!price || !stock || !shares) return next({code: 403, error: 'Invalid data submitted'});

        Portfolio
            .findOne({userId})
            .then(portfolio => {
                if(!(stock in portfolio.stocks)) throw {code: 403, error: 'user currently does not own this stock'};
                if(shares > portfolio.stocks[stock]) throw {code: 403, error: 'user requesting to sell more shares then they possess'};
                
                portfolio.stocks[stock] -= shares;
                
                if(portfolio.stocks[stock] === 0) delete portfolio.stocks[stock];
                portfolio = adjustPortfolio(portfolio, 'sell', cost);
                portfolio.markModified('stocks');
                return portfolio.save();
            })
            .then(portfolio => {
                res.send(portfolio);
            })
            .catch(next);
    });


module.exports = router;