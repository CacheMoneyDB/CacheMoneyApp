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

                // console.log('Data', data);
                $('#leaderboard').empty();
                module.leaderBoardModel.formatData(data, function(err, formattedData){
                    formattedData.forEach(function (leaderboardEntry){
                        leaderBoardData.renderStock(leaderboardEntry);
                    });
                });
            }).fail(function(jqxhr, status){
                console.log('leaderboard AJAX request has failed', status, jqxhr);
            });
        });
    };

    leaderBoardData.tab();


    leaderBoardData.renderStock = function(leaderBoardDataEntry){
        // console.log('SData', leaderBoardDataEntry);
        $('#leaderboard').append(leaderCompiler(leaderBoardDataEntry));
    };

    module.leaderBoardData = leaderBoardData;

})(window);
