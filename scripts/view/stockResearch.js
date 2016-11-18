(function(module){

    var stockSearch = {};

    var stockCompiler = Handlebars.compile($('#search-template').text());

    stockSearch.addButton = function() {
        $('#search-button').on('click touchstart', function (event){
            event.preventDefault();
            $('.error-msg').remove();
            stockSearch.ticker = $(this).prev().val().toUpperCase();
            $.ajax({
                url: '/yapi?stocks=' + stockSearch.ticker
            }).done(function(data){
                if(data.historical.length === 0) {
                    $('#stock-search').append('<span class="error-msg"><br>Please enter a valid stock ticker.</span>');
                };
                if(!data.snapshot[0].ask) {
                    data.snapshot[0].ask = data.historical[data.historical.length - 1].close;
                    data.snapshot[0].daysLow = data.historical[data.historical.length - 1].low;
                    data.snapshot[0].daysHigh = data.historical[data.historical.length - 1].high;
                };
                stockSearch.data = data.snapshot[0];
                // pass the historical data along for now
                stockResearchModel(data.historical, $('#stockchart')[0]);
                stockSearch.renderStock(data.snapshot[0]);
            });
        });
    };

    stockSearch.addButton();

    stockSearch.renderStock = function(snapShot){
        $('#stock-data').empty().append(stockCompiler(snapShot));
    };

    module.stockSearch = stockSearch;

})(window);