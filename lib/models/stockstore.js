const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stockSchema = new Schema({
    stocks: {
        type: Schema.Types.Mixed,
        default: {}
    }
});

stockSchema.methods.updateStocks = function(stockTicker) {
    stockTicker = stockTicker.toUpperCase();
    return this.stocks[stockTicker] = true;
};

module.exports = mongoose.model('stockstore', stockSchema);


// "serve-favicon": "^2.3.0"
