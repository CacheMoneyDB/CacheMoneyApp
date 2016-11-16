(function(module){

    var leaderBoardData = {};

    var leaderCompiler = Handlebars.compile($('#leader-template').text());

    leaderBoardData.tab = function() {
        $('#leaderboard-event').on('click', function(){
            $.ajax({
                headers:{
                    Authorization: 'Bearer ' + module.localStorage.getItem('token')
                },
                contentType: 'application/json',
                url: '/portfolios/leaderboard'
            }).done(function(data){
                console.log('Data', data);
                leaderBoardData = data;
                leaderBoardData.renderStock();
            }).fail(function(jqxhr, status){
                console.log('leaderboard AJAX request has failed', status, jqxhr);
            });
        });
    };

    leaderBoardData.tab();


    leaderBoardData.renderStock = function(){
        console.log('SData', stockSearch);
        $('#leaderboard').empty().append(leaderCompiler(leaderBoardData));
    };

    module.leaderBoardData = leaderBoardData;

})(window);
