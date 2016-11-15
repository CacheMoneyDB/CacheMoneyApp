(function(module) {
    // const users = require('../lib/routes/users');
    var login = {};

    login.newUser = function() {
        $('#signup-button').on('click', function(event) {
            event.preventDefault();
            let username = $('#new-user-name').val();
            // let email = $('#new-user-email').val();
            let password = $('#new-user-pw').val();
            $.ajax({
                url: '/users/signup',
                type: 'POST',
                data: {username: username, password: password}
            })
            .done(function(user) {
                console.log('new user created: ', user);
            });
        });
    };

    login.newUser();
    
    module.login = login;

})(window);