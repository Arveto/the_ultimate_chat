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
        res.sendFile('index.html', {root: '/debian/app.js'});
    }

});

app.get('/signup', function(req, res){
    res.sendFile('signup.html', {root: '/debian/app.js'});
});

app.post('/signup', urlencodedParser, function(req, res){
        var queryString = "SELECT id FROM users WHERE pseudo = ? AND password = ?";
        connection.query(queryString, [req.body.username, req.body.password], function(error, result, fields){;

        try {    //If the user exists <3
        let test = result[0].id;
        res.cookie('password', req.body.password, {maxAge: 3600000000});
        res.cookie('username', req.body.username, {maxAge: 3600000000});
        res.redirect('/');
        }
        catch(e){   //The doesn't exist
            var queryString = "SELECT id FROM users WHERE pseudo = ?";
            connection.query(queryString, [req.body.username], function(error, result, fields){
                try{   //If the pseudo exists
                    let test = result[0].id;
                    res.redirect('/signup');
                }
                catch(e){   //The pseudo doesn't exist: account is created
                    var queryString = "INSERT INTO users (`pseudo`, `password`) VALUES (?, ?)";
                    connection.query(queryString, [req.body.username, req.body.password], function(error, result, fields){
                        if (error) throw error;
                    });
                    res.cookie('password', req.body.password);
                    res.cookie('username', req.body.username);
                    res.redirect('/');
                }
            });
        }
    });
});


    //Events
io.sockets.on('connection', function(socket){
    var queryString = "UPDATE users SET socket_id = ? WHERE password = ?";
    connection.query(queryString, [socket.id, password], function (error, result, fields) {    //Updates socket_id
        if (error) throw error;
    });

        //The user needs to see the rooms list
    var queryString = 'SELECT name, id, n_users FROM rooms';
    connection.query(queryString, function (error, result, fields) {    //Selects avalaible rooms
        if (error) throw error;
        for(var i=0; i<result.length; i++){
            socket.emit('room', {'roomName': result[i].name, 'room_id': result[i].id, 'entrants': result[i].n_users});
        }
    });

    serverEvents.chatEvents(socket, connection);

    //The user leaves the site
    socket.on('disconnect', function(){

		var queryString = 'SELECT room_id FROM users WHERE socket_id = id';
		connection.query(queryString, function(error, result, fields){
			if (error) throw error;
			var room_id = result.room_id;
			var queryString = "UPDATE rooms SET n_users = n_users-1 WHERE id = ?";	//Decrementing n_users
			connection.query(queryString, [room_id], function(error, result, fields){
				if (error) throw error;
			});
		});

		queryString = "UPDATE users SET room_id = NULL, socket_id = NULL WHERE socket_id = ?";
        connection.query(queryString, [socket.id], function(error, result, fields){
            if (error) throw error;
        });
    });
});

server.listen(80);
