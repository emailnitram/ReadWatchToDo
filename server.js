var express = require('express');
var http = require('http');
var https = require('https');
var app = express();

app.use(express.bodyParser());
//app.static('./public');
app.configure(function(){
  //app.use('/media', express.static(__dirname + '/media'));
  app.use(express.static(__dirname + '/public'));
});

app.post('/getPageInfo', function(req, res){
  if(req.body.url[4] === 's'){
    https.get(req.body.url, function(response) {
    response.on('data', function (chunk) {
      // var page = chunk.toString();
      // console.log(typeof page);
      // console.log(page.match(/<meta property="og:image" content="(.+)"/));
      // console.log(page.match(/<title>(.+)<\/title>/));
      res.send(chunk);
    });
    }).on('error', function(e) {
      console.log("Got error: " + e.message);
    });
  } else {
    http.get(req.body.url, function(response) {
      response.on('data', function (chunk) {
        res.send(chunk);
      });
    }).on('error', function(e) {
      console.log("Got error: " + e.message);
    });
  }
});
app.listen(3000);
console.log('Listening on port 3000');