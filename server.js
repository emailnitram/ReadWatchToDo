var static = require('node-static');
var http = require('http');

var headers = {"Access-Control-Allow-Origin" : "*"};
var file = new(static.Server)('./public',headers);
http.createServer(function (req, res) {
  //res.headers("Access-Control-Allow-Origin", "*");
  file.serve(req, res);
}).listen(8080);
