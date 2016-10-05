var request = require('request');
var q = require("q");


//this function will take two params APP_ID and APP_SECRET which you can get from facebok developer dashboard
//and will return ACCESS_TOKEN 
///////////////////////////////////////////////////////////////////////////////////////////////////////////// 
exports.getAccessToken = function (APP_ID, APP_SECRET) {
    var deferred = q.defer();
    request('https://graph.facebook.com/oauth/access_token?client_id=' + APP_ID + '&client_secret=' + APP_SECRET + '&grant_type=client_credentials',
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var ACCESS_TOKEN = body.toString().split('=').pop();
                deferred.resolve(ACCESS_TOKEN);
            } else {
                deferred.reject(error);
            }
        })
    return deferred.promise;
}


//this function will take two params
//usertoken is what user get on frontend authentication
//userID is uid of facebook user 
//ACCESS_TOKEN is a token which will prove you as authenticated application on facebook server
//////////////////////////////////////////////////////////////////////////////////////////////
exports.getUserObject = function (userID, userToken, ACCESS_TOKEN) {
    var deferred = q.defer();
    request('https://graph.facebook.com/' + userID + '?fields=name,email,permissions,picture&input_token=' + userToken + '&access_token=' + ACCESS_TOKEN,
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                deferred.resolve(body);
            } else {
                deferred.reject(error);
            }
        })
    return deferred.promise;
}





