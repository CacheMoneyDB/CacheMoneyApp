//Using Page.js to control routing from section to section

page('/', loginCtrl.show);
page('/login', loginCtrl.show);
page('/search', searchCtrl.show);
page('/portfolio', portfolioCtrl.show);
page('/leaderboard', leaderboardCtrl.show);
page('/about', aboutCtrl.show);

page();