(function(module) {

    var login = {};

    $(function() {
        if (localStorage.token) {
            $.ajax({
                url: '/users/validate',
                type: 'POST',
                contentType: 'application/json',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.token
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

    login.newUser = function() {
        $('#signup-button').on('click', function(event) {
            event.preventDefault();
            $('.error-msg').empty();
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
                console.log('new user created: ', user);
                localStorage.setItem('token', user.token);
                login.loggedIn(user.username);
            });
        });
    };

    login.existingUser = function() {
        $('#signin-button').on('click', function(event) {
            event.preventDefault();
            $('.error-msg').empty();
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
            });

        });
    };


    login.loggedIn = function(user) {
        $('#signin-form').hide();
        $('#signup-form').hide();
        $('#logged-in').hide();
        $('#login')
            .prepend('<section id="logged-in"><span>Welcome! You are logged in as ' + user + '.</span><button type="button" id="logout-button">Log Out</button></section>');
        login.logOut();
    };

    login.logOut = function() {
        $('#logout-button').on('click', function(event) {
            event.preventDefault();
            localStorage.removeItem('token');
            $('#logged-in').html('You have logged out. See you next time!');
            $('.error-msg').empty();
            $('#signin-form').show().trigger('reset');
            $('#signup-form').show().trigger('reset');
        });
    };

    login.newUser();
    login.existingUser();

    module.login = login;

})(window);
