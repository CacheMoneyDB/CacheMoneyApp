// (function(module){

    var stockSearch = {};

    stockSearch.addButton = function() {
        $('#search-button').on('click', function (){
            console.log($(this.data));
            var ticker = $(this).data('ticker');
            console.log('ticker', ticker);
        });
    };

//     module.stockResearchView = stockResearchView;

// })(window);