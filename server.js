var express = require("express");
var path = require("path");
var bodyparser = require("body-parser");
var https = require('https');
var cors = require('cors');

var app = express();
app.use(cors());
app.use(bodyparser.json({}));
app.set('port', (process.env.PORT || 3000));
app.set('APP_ID', "1286316678087115");
app.set('APP_SECRET', "848300d200c6e5e3435a520ec2e0feef");


//making http request is picked from here: http://stackoverflow.com/questions/9577611/http-get-request-in-node-js-express
app.post("/verifyUserAccessToken", (request, response) => {

    var authObject = request.body.facebookAuthObject;
    //token to be verified in this request
    var userToken = authObject.authResponse.accessToken;
    var userID = authObject.authResponse.userID;

    //first getting App Access Token via graph API. Read more: https://developers.facebook.com/docs/facebook-login/access-tokens/  
    var req = https.get({
        host: 'graph.facebook.com',
        path: '/oauth/access_token?client_id=' + app.get("APP_ID") + '&client_secret=' + app.get('APP_SECRET') + '&grant_type=client_credentials'
    }, function (res) {
        //console.log('STATUS: ' + res.statusCode);
        //console.log('HEADERS: ' + JSON.stringify(res.headers));

        var bodyChunks = [];
        res.on('data', function (chunk) {
            bodyChunks.push(chunk);
        }).on('end', function (data) {
            var body = Buffer.concat(bodyChunks);
            console.log('BODY: ' + body);
            var APP_TOKEN = body.toString().split('=').pop();
            console.log('App Access Token: ' + APP_TOKEN);//now we have our facebook app token and we can verify user token using it so doing it in next lines


            //making another http request
            var req = https.get({
                host: 'graph.facebook.com',
                path: '/' + userID + '?fields=name,email,permissions,picture&input_token=' + userToken + '&access_token=' + APP_TOKEN
            }, function (res) {
                var bodyChunks = [];
                res.on('data', function (chunk) {
                    // You can process streamed parts here...
                    bodyChunks.push(chunk);
                }).on('end', function () {
                    var body = Buffer.concat(bodyChunks);
                    console.log('BODY: ' + body);
                    var userObject = JSON.parse(body.toString());
                    response.send(userObject);

                })
            });
        })
    });
});

var indexPath = path.resolve(__dirname, "public");
app.use(express.static(indexPath));

app.listen(3000, function () {
    console.log("Port Listen 3000");
});