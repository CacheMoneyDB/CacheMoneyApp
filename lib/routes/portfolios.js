const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser').json();
const Portfolio = require('../models/portfolio');

const yahooFinance = require('yahoo-finance');

router
  .get('/:id', (req, res, next) => {
      let id = req.params.id;
      yahooFinance.snapshot({
          symbol: id,
          fields: [ 's', 'a', 'g', 'h', 'y', 'd', 'r', 'b4', 'e', 'j4', 'r6', 's7' ] // s is symbol, a is ask price
      })
      .then(snapshot => res.send(snapshot))
      .catch(next);
  });

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
