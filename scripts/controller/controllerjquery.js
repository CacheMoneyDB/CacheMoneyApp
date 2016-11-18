(function(module) {
    var cssRouting = {};

    cssRouting.setEventListener = function() {
        $('nav ul').on('click touchstart', 'a', function(event) {
            event.preventDefault();
            var $this = $(this);
            console.log($this);
            var text = $this.find('li').text().toLowerCase();
            console.log(text);
            $('.main-section').hide();
            $(`#${text}`).fadeIn();
        });
    }; 

    cssRouting.setEventListener();

    module.cssRouting = cssRouting;
})(window)