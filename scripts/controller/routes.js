//Using Page.js to control routing from section to section

page('/login', loginCtrl.show);
page('/portfolio', portfolioCtrl.show);
page('/search', searchCtrl.show);
page('/leaderboard', leaderboardCtrl.show);
page('/about', aboutCtrl.show);
page('/', loginCtrl.show);

page();