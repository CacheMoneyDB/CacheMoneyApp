(function(module){

    var stockTrans = {};

    var cashValueCompiler = Handlebars.compile($('#purchase-template').text());

    stockTrans.addButton = function() {
        $('#buy-button').on('click', function (event){
            event.preventDefault();
            // stockTrans.shares = $(this).prev().val();
            // console.log('stockSearch stockTrans: ', stockSearch);
            stockTrans.shares = parseInt($(this).prev().val());
            stockTrans.stock = stockSearch.data.symbol;
            stockTrans.price = stockSearch.data.ask;
            // stockTrans.cashEffect = -(stockTrans.shares * stockTrans.price);
            var dataToSend = {stock: stockTrans.stock, shares: stockTrans.shares, price: stockTrans.price};
            var token = 'Bearer ' + module.localStorage.getItem('token');
            console.log('here\'s the token', token);
            dataToSend = JSON.stringify(dataToSend);
            // console.log('datatosend', dataToSend);
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
                //     Authorization: 'Bearer ' + module.localStorage.getItem('token')
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
