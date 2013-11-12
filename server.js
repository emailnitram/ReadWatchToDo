var express = require('express');
var http = require('http');
var https = require('https');
var app = express();

app.use(express.bodyParser());
app.configure(function(){
  app.use(express.static(__dirname + '/public'));
});

app.post('/getPageInfo', function(req, res){
  if(req.body.url[4] === 's'){
    https.get(req.body.url, function(response) {
    var body = '';
    response.on('data', function (chunk) {
      body += chunk;
    });
    response.on('end', function () {
      res.send(body);
    });
    }).on('error', function(e) {
      console.log("Got error: " + e.message);
    });
  } else {
    http.get(req.body.url, function(response) {
      var body = '';
      response.on('data', function (chunk) {
        body += chunk;
      });
      response.on('end', function () {
        res.send(body);
      });
    }).on('error', function(e) {
      console.log("Got error: " + e.message);
    });
  }
});
app.listen(3000);
console.log('Listening on port 3000');
