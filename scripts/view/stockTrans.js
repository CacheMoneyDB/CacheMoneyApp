(function(module){

    var stockTrans = {};

    var cashValueCompiler = Handlebars.compile($('#purchase-template').text());

    stockTrans.addButton = function() {
        $('#buy-button').on('click', function (event){
            event.preventDefault();
            stockTrans.shares = parseInt($(this).prev().val());
            stockTrans.stock = stockSearch.data.symbol;
            stockTrans.price = stockSearch.data.ask;
            // stockTrans.cashEffect = -(stockTrans.shares * stockTrans.price);
            var dataToSend = {stock: stockTrans.stock, shares: stockTrans.shares, price: stockTrans.price};
            dataToSend = JSON.stringify(dataToSend);
            console.log('datatosend', dataToSend);
            $.ajax({
                headers:{
                    Authorization: 'Bearer ' + module.localStorage.getItem('token')
                },
                contentType: 'application/json',
                url: '/portfolios/buy',
                type: 'PUT',
                data: dataToSend                
            }).done(function(data){
                console.log('data', data.cashValue);
                // renderCashValue(data);
            }).fail(function(jqxhr, status){
                console.log('buy AJAX request has failed', status, jqxhr);
            });
        });

    };

    stockTrans.addButton();

    renderCashValue = function(data){
        $('#account-info').empty().append(cashValueCompiler(data.cashValue));
    };

    module.stockTrans = stockTrans;

})(window);