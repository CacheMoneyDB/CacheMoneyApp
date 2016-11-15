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
            });
        });
    };

    login.newUser();
    
    module.login = login;

})(window);