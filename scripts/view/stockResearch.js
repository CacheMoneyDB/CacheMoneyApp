(function(module){

    var stockSearch = {};

    var stockCompiler = Handlebars.compile($('#search-template').text());

    stockSearch.addButton = function() {
        $('#search-button').on('click', function (event){
            event.preventDefault();
            $('.error-msg').empty();
            stockSearch.ticker = $(this).prev().val().toUpperCase();
            $.ajax({
                url: '/yapi?stocks=' + stockSearch.ticker
            }).done(function(data){
                if(data.historical.length === 0) {
                    $('#stock-search').append('<br><span class="error-msg">Please enter a valid stock ticker.</span>');
                }
                stockSearch.data = (data.snapshot[0]);
                // pass the historical data along for now
                stockResearchModel(data.historical, $('#stockchart')[0]);
                stockSearch.renderStock();
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