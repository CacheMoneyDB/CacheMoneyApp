(function(module) {
    var cssRouting = {};

    cssRouting.setEventListener = function() {
        $('nav ul').on('click touchstart', 'a', function(event) {
            event.preventDefault();
            var $this = $(this);
            var text = $this.find('li').text().toLowerCase();
            $('.main-section').hide();
            $(`#${text}`).fadeIn();
        });
    }; 

    cssRouting.setEventListener();

    module.cssRouting = cssRouting;
})(window)