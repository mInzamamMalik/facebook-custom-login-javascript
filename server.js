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


//verifying token is picked from here: http://stackoverflow.com/questions/9577611/http-get-request-in-node-js-express
app.get("/verifyUserAccessToken", (request, response) => {

    //first getting App Access Token via graph API. Read more: https://developers.facebook.com/docs/facebook-login/access-tokens/  
    var options = {
        host: 'graph.facebook.com',
        path: '/oauth/access_token?client_id=' + app.get("APP_ID") + '&client_secret=' + app.get('APP_SECRET') + '&grant_type=client_credentials'
    };
    var req = https.get(options, function (res) {
        //console.log('STATUS: ' + res.statusCode);
        //console.log('HEADERS: ' + JSON.stringify(res.headers));

        // Buffer the body entirely for processing as a whole.
        var bodyChunks = [];
        res.on('data', function (chunk) {
            // You can process streamed parts here...
            bodyChunks.push(chunk);
        }).on('end', function () {
            var body = Buffer.concat(bodyChunks);

            console.log('BODY: ' + body);//now we have 
            console.log('App Access Token: ' + body);//now we have 

            response.send("response");

        })
    });
});

var indexPath = path.resolve(__dirname, "public");
app.use(express.static(indexPath));

app.listen(3000, function () {
    console.log("Port Listen 3000");
});