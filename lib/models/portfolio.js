const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const portfolio = new Schema({
    id: {
        type: Schema.Types.ObjectId,
        stocks: {
            ticker: {
                name: {
                    type: String
                },
                shares: {
                    type: Number
                },
                ticker: {
                    type: String
                }
            }
        },
        cashValue: {
            type: Number
        }
    }
});

portfolio.methods.purchaseStock = function(){
    console.log('..stock purchased');
};

portfolio.methods.sellStock = function(){
    console.log('...stock sold');
};

portfolio.methods.net = function(){
    console.log('total net worth is...');
};

module.exports = mongoose.model('portfolio', portfolio);
