(function(module){

    var stockSearch = {};

    var stockCompiler = Handlebars.compile($('#search-template').text());

    stockSearch.addButton = function() {
        $('#search-button').on('click', function (event){
            event.preventDefault();
            stockSearch.ticker = $(this).prev().val().toUpperCase();
            $.ajax({
                url: '/yapi?stocks=' + stockSearch.ticker
            }).done(function(data){
                // console.log('Data', data);
                stockSearch.data = (data.snapshot[0]);
                stockSearch.renderStock();
            }).fail(function(jqxhr, status){
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