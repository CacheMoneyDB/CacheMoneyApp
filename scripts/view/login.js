(function(module) {

    var login = {};

    login.callPortfolio = function(token) {
        $.ajax({
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
        .done(data => {
            stockTrans.renderCashValue(data)
        });
    };

    $(function() {
        if (localStorage.token) {
            $.ajax({
                url: '/users/validate',
                type: 'POST',
                contentType: 'application/json',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                error: function(error) {
                    console.log(error);
                }
            })
            .done(function(username) {
                login.loggedIn(username.username);
            });
        }
    });

    login.clearAll = function() {
        $('#stock-data').empty();
        $('#canvas-holder').hide();
        $('#portfolio-details').empty();
        $('#signin-form').show().trigger('reset');
        $('#signup-form').show().trigger('reset');
        $('#account-balance').empty()
        $('#leaderboard-table').empty();
        $('#stock-search-input').trigger('reset');
        $('input').trigger('reset');
        $('.error-msg').remove();
        $('.msg').remove();
    };

    login.newUser = function() {
        $('#signup-button').on('click touchstart', function(event) {
            event.preventDefault();
            $('.error-msg').remove();
            $('#logged-in').empty();
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
                    $('#signup-form').prepend('<span class="error-msg">Error: ' + error.responseJSON.error + '</span>');
                }
            })
            .done(function(user) {
                localStorage.setItem('token', user.token);
                login.loggedIn(user.username);
                login.callPortfolio(user.token);
            });
        });
    };

    login.existingUser = function() {
        $('#signin-button').on('click touchstart', function(event) {
            event.preventDefault();
            $('.error-msg').remove();
            $('#logged-in').empty();
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
                    $('#signin-form').prepend('<span class="error-msg">Error: ' + error.responseJSON.error + '</span>');
                }
            })
            .done(function(user) {
                console.log('user logged in as: ', user);
                localStorage.setItem('token', user.token);
                login.loggedIn(user.username);
                login.callPortfolio(user.token);
            });
        });
    };


    login.loggedIn = function(user) {
        $('#signin-form').hide();
        $('#signup-form').hide();
        $('#logged-in').hide();
        $('input').trigger('reset');
        $('#login')
            .prepend('<section id="logged-in"><span>Welcome! You are logged in as ' + user + '.</span><button type="button" id="logout-button">Log Out</button></section>');
        login.logOut();
    };

    login.logOut = function() {
        $('#logout-button').on('click touchstart', function(event) {
            event.preventDefault();
            login.clearAll();
            localStorage.removeItem('token');
            $('#logged-in').html('You have logged out. See you next time!');

        });
    };

    login.logOut();
    login.newUser();
    login.existingUser();

    module.login = login;

})(window);
