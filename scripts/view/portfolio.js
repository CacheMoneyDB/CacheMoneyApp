(function(module){

    var portfolioData = {};

    var portfolioCompiler = Handlebars.compile($('#portfolio-template').text());

    portfolioData.tab = function() {
        // console.log('portfolio data tab called');
        $('#portfolio-nav').on('click', function(){
            let token = localStorage.getItem('token');
            $.ajax({
                headers: {
                    authorization: `Bearer ${token}`
                },
                url: '/portfolios',
                type: 'GET',
                contentType: 'application/json',
                error: function(error) {
                    console.log(error);
                }
            })
            .then(data => {
                console.log('my own data', data);
                stockTrans.renderCashValue(data);
                portfolioData.data = data;
                if ('stocks' in data) {
                    var stockArr = Object.keys(portfolioData.data.stocks);
                    var stockKeyValue = stockArr.filter((key) => {
                        if (portfolioData.data.stocks[key] !== 0) {
                            return key;
                        };
                    }).map((key) => {
                        return {
                            key: key, //the name of the stock that comes from stockArr
                            stock: portfolioData.data.stocks[key] //the # of stocks you own
                        };
                    });
                    portfolioData.data.stockKeyValue = stockKeyValue;
                };
                portfolioData.renderStock();
            })
            .catch(err => {
                console.log('portfolio err: ', err);
            });
        });
    };

    portfolioData.tab();

    portfolioData.renderStock = function(){
        portfolioData.data.cashValue = (Math.round(portfolioData.data.cashValue*Math.pow(10,2))/Math.pow(10,2)).toFixed(2);
        portfolioData.data.netValue = (Math.round(portfolioData.data.netValue*Math.pow(10,2))/Math.pow(10,2)).toFixed(2);
        portfolioData.data.stockValue = (Math.round(portfolioData.data.stockValue*Math.pow(10,2))/Math.pow(10,2)).toFixed(2);
        var portfolioId = $('#portfolio');
        // console.log('portfolioData', stockSearch);
        portfolioId.empty().append(portfolioCompiler(portfolioData.data));
    };

    module.portfolioData = portfolioData;

})(window);

            //   let br = '<br>';
            //   console.log(portfolioId);
            //   portfolioId.empty();
            //   portfolioId.append('<h4>ID:</h4>' + data._id + br)
            // .append('<h4>Cash Value</h4>' + data.cashValue + br)
            // .append('<h4>Net Value</h4>' + data.netValue + br)
            // .append('<h4>Stock Value</h4>' + data.stockValue + br)
            // .append('<h4>Stocks</h4>' + Object.keys(data.stocks) + br)
            // .append('<h4>User Id</h4>' + data.userId + br);