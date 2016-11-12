const express = require('express');
const router = express.Router();
const yahooFinance = require('yahoo-finance');

router

  .get('/:id', (req, res, next) => {
      let id = req.params.id;
      yahooFinance.snapshot({
          symbol: id,
          fields: [ 'n', 's', 'a', 'g', 'h', 'y', 'd', 'r', 'b4', 'e', 'j4', 'r6', 's7' ] // s is symbol, a is ask price
      })
      .then(snapshot => res.send(snapshot))
      .catch(next);
  });

module.exports = router;
