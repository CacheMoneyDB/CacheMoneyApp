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
<<<<<<< HEAD
                console.log('leaderboardData', data);
                leaderBoardData = data;
                leaderBoardData.renderStock();
=======
                // console.log('Data', data);
                $('#leaderboard').empty();
                module.leaderBoardModel.formatData(data, function(err, formattedData){
                    formattedData.forEach(function (leaderboardEntry){
                        leaderBoardData.renderStock(leaderboardEntry);
                    });
                });
>>>>>>> 336e1ba7a802a48d91db6f3bd46f1be6ce5c9533
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
