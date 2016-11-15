(function(module){

    var stockTrans = {};

    var cashValueCompiler = Handlebars.compile($('#purchase-template').text());

    stockTrans.addButton = function() {
        $('#buy-button').on('click', function (event){
            event.preventDefault();
            stockTrans.shares = $(this).prev().val();
            stockTrans.stock = stockSearch.data.symbol;
            stockTrans.price = stockSearch.data.ask;
            stockTrans.cashEffect = -(stockTrans.shares * stockTrans.price);
            var dataToSend = {stock: stockTrans.stock, shares: stockTrans.shares, price: stockTrans.price};
            dataToSend = JSON.stringify(dataToSend);
            console.log('datatosend', dataToSend);
            $.ajax({
                url: '/portfolios/buy',
                type: 'PUT',
                data: dataToSend                
            }).done(function(data){
                console.log('Data', dataToSend);
            }).fail(function(jqxhr, status){
                console.log('buy AJAX request has failed', status, jqxhr);
            });
        });
        $.ajax({
            url:'/portfolios' + stockTrans.stock
        }).done(function(data){
            console.log('Data', data);
            renderCashValue(data);
        }).fail(function(jqxhr, status){
            console.log('cash value AJAX request has failed', status, jqxhr);
        });

    };

    stockTrans.addButton();

    data.renderCashValue = function(){
        $('#account-info').empty().append(cashValueCompiler(data.cashValue));
    };

    module.stockTrans = stockTrans;

})(window);