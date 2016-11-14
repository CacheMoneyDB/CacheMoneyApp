const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const portfolio = new Schema({
    userId: {
        type: Schema.Types.ObjectId
    },
        // stocks: {
        //     ticker: {
        //         name: {
        //             type: String
        //         },
        //         shares: {
        //             type: Number
        //         },
        //         ticker: {
        //             type: String
        //         }
        //     }
        // },
    stocks:{ 
        type: Schema.Types.Mixed,
        default: {}
    },
    cashValue: {
        type: Number,
        default: 100000
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
