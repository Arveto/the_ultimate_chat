//      Modules
var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);
    path = require('path'),
    bodyParser = require('body-parser');
    cookieParser = require('cookie-parser'); //TODO Parse cookies

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
app.use(cookieParser());


    //Routes
var password;
app.get('/', function(req, res){
    if(req.cookies.password == undefined){
        res.redirect('/signup');
    }
    else{
        password = req.cookies.password;
        res.sendFile('index.html', {root: 'C:\\Programmation\\Web\\Ultimate Chat\\'});
    }

});

app.get('/signup', function(req, res){
    res.sendFile('signup.html', {root: 'C:\\Programmation\\Web\\Ultimate Chat\\'});
});

app.post('/signup', urlencodedParser, function(req, res){
        var userTest;

        var queryString = "SELECT id FROM users WHERE pseudo = ?";
        connection.query(queryString, [req.body.username, req.body.password], function(error, result, fields){
            userTest = result.length; //If the users exists ==1, else ==0;
        });
        console.log(userTest);
        if(userTest){
            var queryString = "INSERT INTO users (`pseudo`, `password`) VALUES (?, ?)";
            connection.query(queryString, [req.body.username, req.body.password], function(error, result, fields){
                if (error) throw error;
            });
            res.cookie('password', req.body.password);
            res.cookie('username', req.body.username);
            res.redirect('/');
        }
});


    //Events
io.sockets.on('connection', function(socket){

    var queryString = "UPDATE users SET socket_id = ? WHERE password = ?";
    connection.query(queryString, [socket.id, password], function (error, result, fields) {    //Updates socket_id
        if (error) throw error
    });

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
        var queryString = "UPDATE users SET room_id = NULL, socket_id = NULL WHERE socket_id = ?";
        connection.query(queryString, [socket.id], function(error, result, fields){
            if (error) throw error;
        });
    });
});

server.listen(80);
