//      Modules
var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);
    path = require('path'),
    bodyParser = require('body-parser');
    //cookieParser = require('cookie-parser'); TODO Parse cookies

var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'ultimate_chat'
});

var serverEvents = require('./server_events.js');

app.use(express.static(path.join(__dirname, 'public')));
var urlencodedParser = bodyParser.urlencoded({extended: false});
//app.use(cookieParser());

    //Variables

    //Routes
app.get('/', function(req, res){
    /*if(res.cookiers == undefined){
        res.redirect('/signup');
    }
    else{*/
        res.sendFile('index.html', {root: 'C:\\Programmation\\Web\\Ultimate Chat\\'});
    //}

});

app.get('/signup', function(req, res){
    res.sendFile('signup.html', {root: 'C:\\Programmation\\Web\\Ultimate Chat\\'});
});

app.post('/signup', urlencodedParser, function(req, res){
        var queryString = "INSERT INTO users (`pseudo`, `password`) VALUES (?, ?)";
        connection.query(queryString, [req.body.password, req.body.username], function(error, result, fields){
            if (error) throw error;
        });
        res.cookie('password', req.body.password).send('Test');
        res.cookie('username', req.body.username).send('Test');
        res.redirect('/');
});

io.sockets.on('connection', function(socket){

        //The user needs to see the rooms list
    var queryString = 'SELECT name, id, n_users FROM rooms';
    connection.query(queryString, function (error, result, fields) {    //Selects avalaible rooms
        if (error) throw error;
        for(var i=0; i<result.length; i++){
            socket.emit('room', {'roomName': result[i].name, 'num': result[i].id, 'entrants': result[i].n_users});
        }
    });

    serverEvents.chatEvents(socket, connection);

    //The user leaves the site
    socket.on('disconnect', function(){
        var queryString = "UPDATE users SET room_id = NULL, socket_id = NULL where socket_id = ?";
        connection.query(queryString, [socket.id], function(error, result, fields){
            if (error) throw error;
        });
    });
});

server.listen(80);
