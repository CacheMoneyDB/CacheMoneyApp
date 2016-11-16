(function(module){

    var leaderBoardModel= {};

    function leaderboardEntry (object){
        var keys = Object.keys(object);
        var that = this;
        keys.map(function(element){
            that[element] = object[element];
        });
        this.user = object.user[0].username;
    }

    leaderBoardModel.formatData = function (objectArray, callback){
        var formattedLeaderboardData = [];
        objectArray.forEach(function(boardEntry, index){
            boardEntry.place = index + 1;
            formattedLeaderboardData.push(new leaderboardEntry(boardEntry));
        });
        callback(null, formattedLeaderboardData);
    };



    module.leaderBoardModel = leaderBoardModel;

})(window);