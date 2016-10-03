var express = require("express");
var path = require("path");
var bodyparser = require("body-parser");
var FB = require('fb'),
    fb = new FB.Facebook({abc:""});

var cors = require('cors');
var app = express();
app.use(cors());
app.use(bodyparser.json({}));


app.get("/abc", (req, res) => {
    res.send("response");
});

var indexPath = path.resolve(__dirname, "public");
app.use(express.static(indexPath));

app.listen(3000, function () {
    console.log("Port Listen 3000");
});