(function(module) {
    var cssRouting = {};

    cssRouting.setEventListener = function() {
        $('nav ul').on('click touchstart', 'a', function(event) {
            event.preventDefault();
            var $this = $(this);
            var text = $this.find('li').text().toLowerCase();
            $('.main-section').hide();
            if(module.localStorage.getItem('token') && text === 'login') {
                $('#signin-form').hide();
                $('#signup-form').hide();
                $('#login').fadeIn();
            } else {
                $(`#${text}`).fadeIn();
            };
        });
    }; 

    cssRouting.setEventListener();

    module.cssRouting = cssRouting;
})(window)