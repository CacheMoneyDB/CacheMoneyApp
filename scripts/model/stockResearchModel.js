(function(module) {

    function stockResearchModel(objectArray, domElement) {
        var dateArray = [];
        var closePriceArray = [];
        var stockName = objectArray[0].symbol;
        objectArray.forEach(function(stockObject) {
            dateArray.push(stockObject.date.split('T')[0]);
            closePriceArray.push(stockObject.close);
        });
        var chartData = {
            labels: dateArray,
            datasets: [{
                    label: `${stockName} Value at Close`,
                    data: closePriceArray
                }]
        };
        stockResearchModel.plotStockChart(chartData, domElement);
    };

    stockResearchModel.plot = '';

    //TODO: determine if this should go in the view
    stockResearchModel.plotStockChart = function(plotData, domNode) {
        var canvasContext = domNode.getContext('2d');
        var gradient = canvasContext.createLinearGradient(0,0,0,460);
        gradient.addColorStop(0, 'rgba(60, 179, 113, 0.8)');
        gradient.addColorStop(1, 'rgba(25, 25, 112, 0.8)');
        if (stockResearchModel.plot) stockResearchModel.plot.destroy();
        stockResearchModel.plot = new Chart(domNode, {
            type: 'line',
            data: plotData,
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            fontSize: 20,
                            fontFamily: 'sans-serif'
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            fontSize: 20,
                            fontFamily: 'sans-serif'
                        }
                    }]
                }
            }
        });
    };

    stockResearchModel.all = [];
    module.stockResearchModel = stockResearchModel;
})(window);