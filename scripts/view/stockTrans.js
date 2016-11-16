(function(module){

    var stockTrans = {};

    var cashValueCompiler = Handlebars.compile($('#purchase-template').text());

    stockTrans.addButton = function() {
        $('#buy-button').on('click', function (event){
            console.log('hi');
            event.preventDefault();
            // stockTrans.shares = $(this).prev().val();
            // console.log('stockSearch stockTrans: ', stockSearch);
            stockTrans.shares = parseInt($(this).prev().val());
            stockTrans.stock = stockSearch.data.symbol;
            stockTrans.price = stockSearch.data.ask;
            var dataToSend = {stock: stockTrans.stock, shares: stockTrans.shares, price: stockTrans.price};
            // var token = 'Bearer ' + module.localStorage.getItem('token');
            dataToSend = JSON.stringify(dataToSend);
            let token = localStorage.getItem('token');
            $.ajax({
// beginning of prior conflict
                beforeSend: (request) =>{
                    request.setRequestHeader('authorization', `Bearer ${token}`);
                },
                url: '/portfolios/buy',
                contentType: 'application/json',

//merge conflict here but i think it's the top one that's correct
                // headers:{
                    // Authorization: 'Bearer ' + module.localStorage.getItem('token')
                // },
                // contentType: 'application/json',
                // url: '/portfolios/buy',
                // headers: {
                //     'Authorization': token
                // },
                // contentType: 'application/json',
                type: 'PUT',
                data: dataToSend
            }).done(function(data){
                stockTrans.renderCashValue(data);
            }).fail(function(jqxhr, status){
                console.log('buy AJAX request has failed', status, jqxhr);
            });
        });
    };

    stockTrans.addButton();

    stockTrans.sellButton = function() {
        $('#sell-button').on('click', function (event){
            event.preventDefault();
            stockTrans.shares = parseInt($(this).prev().val());
            stockTrans.stock = stockSearch.data.symbol;
            stockTrans.price = stockSearch.data.ask;
            var dataToSend = {stock: stockTrans.stock, shares: stockTrans.shares, price: stockTrans.price};
            var token = 'Bearer ' + module.localStorage.getItem('token');
            console.log('here\'s the token', token);
            dataToSend = JSON.stringify(dataToSend);
            $.ajax({
                headers:{
                    Authorization: 'Bearer ' + module.localStorage.getItem('token')
                },
                contentType: 'application/json',
                url: '/portfolios/sell',
                headers: {
                    'Authorization': token
                },
                contentType: 'application/json',
                type: 'PUT',
                data: dataToSend
            }).done(function(data){
                stockTrans.renderCashValue(data);
            }).fail(function(jqxhr, status){
                console.log('buy AJAX request has failed', status, jqxhr);
            });
        });
    };

    stockTrans.sellButton();

    stockTrans.renderCashValue = function(data){
        console.log('cash value', data.cashValue);
        data.cashValue = (Math.round(data.cashValue*Math.pow(10,2))/Math.pow(10,2)).toFixed(2);
        $('#account-balance').empty().append(cashValueCompiler(data));
    };

    module.stockTrans = stockTrans;

})(window);
