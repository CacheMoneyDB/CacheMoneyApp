(function(module){

    var stockSearch = {};

    var stockCompiler = Handlebars.compile($('#search-template').text());

    stockSearch.addButton = function() {
        $('#search-button').on('click', function (event){
            event.preventDefault();
            stockSearch.ticker = $(this).prev().val().toUpperCase();
            console.log('ticker', stockSearch.ticker);
            if(!stockSearch.ticker){
                $('#stock-data').append('<span>That is not a Stock Ticker</span>');
            };
            $.ajax({
                url: '/yapi?stocks=' + stockSearch.ticker
            }).done(function(data){
                // console.log('Data', data);
                stockSearch.data = (data.snapshot[0]);
                // pass the historical data along for now
                stockResearchModel(data.historical, $('#stockchart')[0]);
                stockSearch.renderStock();
            }).fail(function(jqxhr, status){
                // if(status === '304'){
                //     $('#stock-data').append('<span>That is not a Stock Ticker</span>');
                // };
                console.log('ticker AJAX request has failed', status, jqxhr);
            });
        });
    };

    stockSearch.addButton();

    stockSearch.renderStock = function(){
        // console.log('SData', stockSearch);
        $('#stock-data').empty().append(stockCompiler(stockSearch.data));
    };

    module.stockSearch = stockSearch;

})(window);