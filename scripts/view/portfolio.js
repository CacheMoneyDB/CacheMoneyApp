(function(module){

    var portfolioData = {};

    var portfolioCompiler = Handlebars.compile($('#portfolio-template').text());

    portfolioData.tab = function() {
        $('#portfolio-nav').on('click touchstart', function(){
            // let token = localStorage.getItem('token');
            $.ajax({
                headers: {
                    Authorization: 'Bearer ' + module.localStorage.getItem('token') 
                },
                type: 'GET',
                contentType: 'application/json',
                url: '/portfolios',
            })
            .done(data => {
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
            .fail((jqxhr, status) => {
                console.log('portfolio err: ', jqxhr, status);
            });
        });
    };

    portfolioData.tab();

    portfolioData.renderStock = function(){
        portfolioData.data.cashValue = (Math.round(portfolioData.data.cashValue*Math.pow(10,2))/Math.pow(10,2)).toFixed(2);
        portfolioData.data.netValue = (Math.round(portfolioData.data.netValue*Math.pow(10,2))/Math.pow(10,2)).toFixed(2);
        portfolioData.data.stockValue = (Math.round(portfolioData.data.stockValue*Math.pow(10,2))/Math.pow(10,2)).toFixed(2);
        var portfolioId = $('#portfolio');
        portfolioId.empty().append(portfolioCompiler(portfolioData.data));
    };

    module.portfolioData = portfolioData;

})(window);