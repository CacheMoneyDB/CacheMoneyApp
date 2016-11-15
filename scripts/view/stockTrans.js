(function(module){

    var stockTrans = {};

    // var stockCompiler = Handlebars.compile($('#search-template').text());

    stockTrans.addButton = function() {
        $('#buy-button').on('click', function (event){
            event.preventDefault();
            stockTrans.shares = $(this).prev().val();
            console.log('shares', stockTrans.shares);
            stockTrans.stock = $('p#data-ticker');
            console.log('ticker', stockTrans.stock);
            stockTrans.price = $('p#data-price');
            stockTrans.cashEffect = -(stockTrans.shares * stockTrans.price);
            // $.ajax({
            //     url: '/portfolios/buy/' + stockTrans.stock,
            //     type: PUT,
            //     data:                 
            // }).done(function(data){
            //     console.log('Data', data);
            //     stockSearch.data = (data[0]);
            //     stockSearch.renderStock();
            // }).fail(function(jqxhr, status){
            //     console.log('ticker AJAX request has failed', status, jqxhr);
            // });
        });
    };

    stockTrans.addButton();

    // stockTrans.renderStock = function(){
    //     console.log('STrans', stockTrans);
    //     $('#stock-data').empty().append(stockCompiler(stockTrans.data));
    // };

    module.stockTrans = stockTrans;

})(window);