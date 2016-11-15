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
            .getAll()
            .then(portfolios => {
                res.send(portfolios);
            })
            .catch(next);
    })

    .get('/topfive', bodyParser, (req, res, next) => {
        Portfolio
            .aggregate([
                { $sort: { netValue: -1 } },
                { $limit: 5 }
            ])
            .then(portfolios => {
                portfolios.forEach((portfolio, index) => {
                    portfolio.populate({
                        path: 'userId',
                        select: 'username'
                    }).lean();
                    if (index === (portfolios.length() - 1)) res.send(portfolios);
                });
            })
            .catch(next);
    })

    .get('/', bodyParser, (req,res,next) => {
        const userId = req.user.id;
        const stockValueMap = {};
        Portfolio
            .findOne({userId})
            .then(portfolio => {
                const stockTickers = Object.keys(portfolio.stocks);
                yahooFinance.snapshot({
                    symbols: stockTickers,
                    fields: [ 'n', 's', 'a', 'g', 'h', 'y', 'd', 'r', 'b4', 'e', 'j4', 'r6', 's7' ]
                })
                .then(snapshots => {
                    snapshots.forEach(snapshot => {
                        stockValueMap[snapshot.symbol] = snapshot.ask;
                    });
                    let stockValue = 0;
                    for(let keys in portfolio.stocks){ //calculates total stock value for each stock in each portfolio
                        stockValue += stockValueMap[keys] * portfolio.stocks[keys];
                    };
                    portfolio.stockValue = stockValue;
                    portfolio.netCalc();
                    res.send(portfolio);
                });
            })
            .catch(next);
    })

    .put('/buy', bodyParser, (req, res, next) => {
        const {stock, shares, price} = req.body; //have object be {stock:ticker, shares:number, price:cost}?
        const userId = req.user.id;
        Promise.all([
            Portfolio
                .findOne({userId})
                .then(portfolio => {
                    // console.log('portfolio', portfolio);

                    if(stock in portfolio.stocks) portfolio.stocks[stock] += shares;
                    else portfolio.stocks[stock] = shares;

                    // console.log('portfolio after', portfolio);
                    portfolio.cashValue -= (price * shares);
                    portfolio.markModified('stocks');
                    return portfolio.save();
                }),
            stockStore
                .findOne() //assumes there will be no changes!
                .then(store => {
                    store.updateStocks(stock);
                    store.markModified('stocks');
                    return store.save();
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
        Portfolio
            .findOne({userId})
            .then(portfolio => {
                // console.log('portfolio', portfolio);
                portfolio.stocks[stock] -= shares;
                portfolio.cashValue += (price * shares);
                portfolio.markModified('stocks');
                return portfolio.save();
            })
            .then(portfolio => {
                res.send(portfolio);
            })
            .catch(next);
    });

  // .delete



  //quandl has the data over time


//min of the day
//max of the day

//get the closing price of the stock (1pm)
  //when you have the


//(G)day low, (H)day high, dividend yield(y), dividend per share(d),

//(r) pe ratio, (b4) book value, (e) earnings per share, (j4) ebitda,

// r6: 'Price Per EPS Estimate Current Year',
// s7: 'Short Ratio',


//make a new object with the data,


//parse json data. then you will have an object, then add methods to that object

module.exports = router;
