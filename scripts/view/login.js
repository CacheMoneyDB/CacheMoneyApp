(function(module) {
    $('#signup-button').on('submit', function(event) {
        event.preventDefault();
        $.ajax({
            url: 'users/signup',
            method: 'POST',
            data: ,
            success: 
        })

    })
})(window);