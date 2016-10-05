var express = require("express");
var path = require("path");
var bodyparser = require("body-parser");
var https = require('https');
var cors = require('cors');
var _request = require('request');

var app = express();
app.use(cors());
app.use(bodyparser.json({}));
app.set('port', (process.env.PORT || 3000));
app.set('APP_ID', "1286316678087115");
app.set('APP_SECRET', "848300d200c6e5e3435a520ec2e0feef");

//making http request is picked from here: http://stackoverflow.com/questions/9577611/http-get-request-in-node-js-express
app.post("/verifyUserAccessToken", (req, res) => {

    var authObject = req.body.facebookAuthObject;
    //token to be verified in this request
    var userToken = authObject.authResponse.accessToken;
    var userID = authObject.authResponse.userID;

    _request('https://graph.facebook.com/oauth/access_token?client_id='
        + app.get("APP_ID") + '&client_secret='
        + app.get('APP_SECRET')
        + '&grant_type=client_credentials',
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var APP_TOKEN = body.toString().split('=').pop();

                _request('https://graph.facebook.com/' + userID
                    + '?fields=name,email,permissions,picture&input_token='
                    + userToken + '&access_token=' + APP_TOKEN,

                    function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            console.log("body: ", body) // Show the HTML for the Google homepage.
                            res.send(body);
                        }
                    })
            }
        })
});

var indexPath = path.resolve(__dirname, "public");
app.use(express.static(indexPath));

app.listen(3000, function () {
    console.log("Port Listen 3000");
});