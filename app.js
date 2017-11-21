//      Modules
var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);
    path = require('path');

    var mysql = require('mysql');
    var connection = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : 'root',
      database : 'ultimate_chat'
    });

    var serverEvents = require('./server_events.js');

app.use(express.static(path.join(__dirname, 'js')));

//      Routes
app.get('/', function(req, res){
    res.sendFile('debug.html', {root: 'C:\\Programmation\\Web\\Ultimate Chat\\'}); //XXX Page for testing purpose only, remove after
});

io.sockets.on('connection', function(socket){
    console.log('User detected...');
    serverEvents.events(socket, connection);
});

server.listen(80);
