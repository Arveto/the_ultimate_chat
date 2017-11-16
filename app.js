//      Modules
var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

var mysql = require('mysql');

var path = require('path');
app.use(express.static(path.join(__dirname, 'js')));

//      Routes
app.get('/', function(req, res){
});

server.listen(80);
