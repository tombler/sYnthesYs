var http = require('http');
var express = require('express');
var app = express();

app.use(express.static(__dirname + '/'));

app.listen(process.env.PORT || 8000);


// var server = http.createServer(function(req, res) {
//   res.writeHead(200);
//   res.end('Will this work');
// });
// server.listen(8000);