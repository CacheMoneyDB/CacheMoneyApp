(function(module){

    var leaderBoardData = {};

    var leaderCompiler = Handlebars.compile($('#leader-template').text());

    leaderBoardData.tab = function() {
        $('#leaderboard-event').on('click touchstart', function(){
            $.ajax({
                headers:{
                    Authorization: 'Bearer ' + module.localStorage.getItem('token')
                },
                type: 'GET',
                contentType: 'application/json',
                url: '/portfolios/leaderboard'
            }).done(function(data){

                $('#leaderboard-table').empty();
                module.leaderBoardModel.formatData(data, function(err, formattedData){
                    $('#leaderboard-table').append('<thead><tr><th>Rank</th><th>Name</th><th>Cash Value</th><th>Stock Value</th><th>Total Value</th></tr></thead><tbody></tbody>');
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
        $('#leaderboard-table tbody').append(leaderCompiler(leaderBoardDataEntry));
    };

    module.leaderBoardData = leaderBoardData;

})(window);
