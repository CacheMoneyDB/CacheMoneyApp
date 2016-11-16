(function(module) {
    // const users = require('../lib/routes/users');
    var login = {};

    login.newUser = function() {
        $('#signup-button').on('click', function(event) {
            event.preventDefault();
            let data = {};
            data.username = $('#new-user-name').val();
            data.password = $('#new-user-pw').val();
            $.ajax({
                url: '/users/signup',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(data),
                error: function(error) {
                    console.log(error);
                }
            })
            .done(function(user) {
                console.log('new user created: ', user);
                localStorage.setItem('token', user.token);
                $('#signupForm').hide();
            });
        });
    };

    login.existingUser = function() {
        $('#signin-button').on('click', function(event) {
            event.preventDefault();
            let data = {};
            data.username = $('#user-name').val();
            data.password = $('#user-pw').val();
            $.ajax({

                url: '/users/signin',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(data),
                error: function(error) {
                    console.log(error);
                }
            })
            .done(function(user) {
                console.log('new user created: ', user);
                localStorage.setItem('token', user.token);
            })
            ;

        });
    };

    login.portfolioPage = function() {

        // TODO: get portfolio for this user and display it
        //figure out how to get portfolio data from id
        //check mlab. users

        $('#portfolioNav').on('click', function(){
            let token = localStorage.getItem('token');
            $.ajax({
                // beforeSend: (request) =>{
                //     request.setRequestHeader('Authorization', `Bearer ${token}`);
                // },
                headers: {
                    authorization: `Bearer ${token}`
                },
                url: '/portfolios',
                type: 'GET',
                contentType: 'application/json',
                error: function(error) {
                    console.log(error);
                }
            })
            .then(data => {
                console.log('data', data);
                let br = '<br>';
                var portfolioId = $('#portfolio');
                console.log(portfolioId);
                // portfolioId.empty();
                portfolioId.append('<h4>ID:</h4>' + data._id + br)
              .append('<h4>Cash Value</h4>' + data.cashValue + br)
              .append('<h4>Net Value</h4>' + data.netValue + br)
              .append('<h4>Stock Value</h4>' + data.stockValue + br)
              .append('<h4>Stocks</h4>' + Object.keys(data.stocks) + br)
              .append('<h4>User Id</h4>' + data.userId + br);
            });

        });



        // console.log('logged in as ', user);

    };

    login.newUser();
    login.existingUser();
    login.portfolioPage();

    module.login = login;

})(window);
