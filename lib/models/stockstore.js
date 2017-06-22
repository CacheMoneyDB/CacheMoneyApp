const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// I don't know why you would use a single document here
// Better for each stock to be document in the stocks collection.
// Much of the other code using this would have been much simpler
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
