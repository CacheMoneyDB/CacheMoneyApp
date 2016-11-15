(function(module) {

    let loginCtrl = {};

    loginCtrl.show = function() {
        $('.main-section').hide();
        $('#login').fadeIn();
    };

    let searchCtrl = {};

    searchCtrl.show = function() {
        $('.main-section').hide();
        $('#search').fadeIn();
    };

    let portfolioCtrl = {};

    portfolioCtrl.show = function() {
        $('.main-section').hide();
        $('#portfolio').fadeIn();
    };

    let leaderboardCtrl = {};

    leaderboardCtrl.show = function() {
        $('.main-section').hide();
        $('#leaderboard').fadeIn();
    };

    let aboutCtrl = {};

    aboutCtrl.show = function() {
        $('.main-section').hide();
        $('#about').fadeIn();
    };

    module.loginCtrl = loginCtrl;
    module.searchCtrl = searchCtrl;
    module.portfolioCtrl = portfolioCtrl;
    module.leaderboardCtrl = leaderboardCtrl;
    module.aboutCtrl = aboutCtrl;

})(window);