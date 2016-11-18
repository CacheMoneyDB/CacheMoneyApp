(function(module){

    var stockTrans = {};

    var cashValueCompiler = Handlebars.compile($('#purchase-template').text());

    stockTrans.addButton = function() {
        $('#buy-button').on('click touchstart', function (event){
            event.preventDefault();
            $('.msg').remove();
            $('.error-msg').remove();
            stockTrans.shares = parseInt($(this).prev().val());
            if (!stockSearch.data) {
                $('#buy-button').after('<span class="error-msg"><br>You must search for a stock before buying.</span>');
            }
            stockTrans.stock = stockSearch.data.symbol;
            stockTrans.price = stockSearch.data.ask;
            var dataToSend = {stock: stockTrans.stock, shares: stockTrans.shares, price: stockTrans.price};
            dataToSend = JSON.stringify(dataToSend);
            let token = localStorage.getItem('token');
            $.ajax({

                beforeSend: (request) =>{
                    request.setRequestHeader('authorization', `Bearer ${token}`);
                },
                url: '/portfolios/buy',
                contentType: 'application/json',

                type: 'PUT',
                data: dataToSend
            }).done(function(data){
                stockTrans.renderCashValue(data);
                $('#account-info ul').append('<span class="msg">You bought ' + stockTrans.shares + ' shares of ' + stockTrans.stock + '. Good job!');
            }).fail(function(jqxhr, status){
                $('#buy-button').after('<span class="error-msg"><br>Error: ' + jqxhr.responseJSON.error + '</span>');
                console.log('buy AJAX request has failed', status, jqxhr);
            });
        });
    };

    stockTrans.addButton();

    stockTrans.sellButton = function() {
        $('#sell-button').on('click touchstart', function (event){
            event.preventDefault();
            $('.msg').remove();
            $('.error-msg').remove();
            stockTrans.shares = parseInt($(this).prev().val());
            if (!stockSearch.data) {
                $('#sell-button').after('<span class="error-msg"><br>You must search for a stock before selling.</span>');
            }
            stockTrans.stock = stockSearch.data.symbol;
            stockTrans.price = stockSearch.data.ask;
            var dataToSend = {stock: stockTrans.stock, shares: stockTrans.shares, price: stockTrans.price};
            dataToSend = JSON.stringify(dataToSend);
            var token = localStorage.getItem('token');
            $.ajax({

                beforeSend: (request) =>{
                    request.setRequestHeader('authorization', `Bearer ${token}`);
                },
                url: '/portfolios/sell',
                contentType: 'application/json',
                type: 'PUT',
                data: dataToSend
            }).done(function(data){

                stockTrans.renderCashValue(data);
                $('#sell-button').after('<span class="msg"><br>You sold ' + stockTrans.shares + ' shares of ' + stockTrans.stock + '. Good job!');   
            }).fail(function(jqxhr, status){
                $('#sell-button').after('<span class="error-msg"><br>Error: ' + jqxhr.responseJSON.error + '</span>');
                console.log('buy AJAX request has failed', status, jqxhr);
            });
        });
    };

    stockTrans.sellButton();

    stockTrans.renderCashValue = function(data){
        data.cashValue = (Math.round(data.cashValue*Math.pow(10,2))/Math.pow(10,2)).toFixed(2);
        $('#account-balance').empty().append(cashValueCompiler(data));
    };

    module.stockTrans = stockTrans;

})(window);
