(function(module){

    var stockTrans = {};

    var stockCompiler = Handlebars.compile($('#purchase-template').text());

    stockTrans.addButton = function() {
        $('#buy-button').on('click', function (event){
            event.preventDefault();
            stockTrans.shares = $(this).prev().val();
            stockTrans.stock = stockSearch.data.symbol;
            stockTrans.price = stockSearch.data.ask;
            stockTrans.cashEffect = -(stockTrans.shares * stockTrans.price);
            var dataToSend = {stock: stockTrans.stock, shares: stockTrans.shares,price: stockTrans.price};
            dataToSend = JSON.stringify(dataToSend);
            console.log('datatosend', dataToSend);
            $.ajax({
                url: '/portfolios/buy/' + dataToSend.stock,
                type: 'PUT',
                data: dataToSend                
            }).done(function(data){
                console.log('Data', dataToSend);
            }).fail(function(jqxhr, status){
                console.log('buy AJAX request has failed', status, jqxhr);
            });
        });
        $.ajax({
            url:'/portfolios' + dataToSend.stock
        }).done(function(data){
            console.log('Data', data);
            stockTrans.renderStock();
        }).fail(function(jqxhr, status){
            console.log('cash value AJAX request has failed', status, jqxhr);
        });

    };

    stockTrans.addButton();

    // stockTrans.renderStock = function(){
    //     console.log('STrans', stockTrans);
    //     $('#stock-data').empty().append(stockCompiler(stockTrans.data));
    // };

    module.stockTrans = stockTrans;

})(window);