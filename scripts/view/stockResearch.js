(function(module){

    var stockSearch = {};

    stockSearch.addButton = function() {
        $('#search-button').on('click', function (event){
            event.preventDefault();
            stockSearch.ticker = $(this).prev().val();
            console.log('ticker', stockSearch.ticker);
            $.ajax({
                url: '/yapi?stocks=' + stockSearch.ticker
            }).done(function(data){
                console.log('Data', data);
                stockSearch.data = (data[0]);
                console.log('SData', stockSearch);
            }).fail(function(jqxhr, status){
                console.log('ticker AJAX request has failed', status, jqxhr);
            });
        });
    };

    stockSearch.addButton();


    module.stockResearchView = stockResearchView;

})(window);