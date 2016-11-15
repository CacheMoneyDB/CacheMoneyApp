const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser').json();
const Portfolio = require('../models/portfolio');
const stockStore = require('../models/stockstore');

router

    .get('/all', bodyParser, (req, res, next) => {
        Portfolio
            .getAll()
            .then(portfolios => {
                res.send(portfolios);
            })
            .catch(next);
    })

    .get('/', bodyParser, (req,res,next) => {
        const userId = req.user.id;
        Portfolio
            .find({userId})
            .then(portfolio => {
                res.send(portfolio);
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
                    else portfolio.stocks[stock = shares;

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