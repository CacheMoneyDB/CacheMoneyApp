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
                    $('#leaderboard').append('<h1>Leaderboard</h1>');
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
        leaderBoardDataEntry.cashValue = (Math.round(leaderBoardDataEntry.cashValue*Math.pow(10,2))/Math.pow(10,2)).toFixed(2);
        leaderBoardDataEntry.netValue = (Math.round(leaderBoardDataEntry.netValue*Math.pow(10,2))/Math.pow(10,2)).toFixed(2);
        leaderBoardDataEntry.stockValue = (Math.round(leaderBoardDataEntry.stockValue*Math.pow(10,2))/Math.pow(10,2)).toFixed(2);
        $('#leaderboard').append(leaderCompiler(leaderBoardDataEntry));
    };

    module.leaderBoardData = leaderBoardData;

})(window);
