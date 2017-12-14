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
var pseudo;
app.get('/', function(req, res){
    if(req.cookies.password == undefined){
        res.redirect('/signup');
    }
    else{
        password = req.cookies.password;
		pseudo = req.cookies.username;
        res.sendFile('index.html', {root: '/home/debian'});
    }

});

app.get('/signup', function(req, res){
    res.sendFile('signup.html', {root: '/home/debian'});
});

app.post('/signup', urlencodedParser, function(req, res){
        var queryString = "SELECT id FROM users WHERE password = ? AND pseudo = ?";
        connection.query(queryString, [req.body.password, req.body.username], function(error, result, fields){;

        try {    //If the user exists <3
        let test = result[0].id;
        res.cookie('password', req.body.password, {maxAge: 3600000000});
        res.cookie('username', req.body.username, {maxAge: 3600000000});
		console.log('1');
        res.redirect('/');
        }
        catch(e){   //The user doesn't exist
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
					console.log('3');
                    res.redirect('/');
                }
            });
        }
    });
});


    //Events
io.sockets.on('connection', function(socket){
    var queryString = "UPDATE users SET socket_id = ? WHERE pseudo = ?";
	console.log('1) socket_id= '+socket.id);
	connection.query(queryString, [socket.id, pseudo], function (error, result, fields) {    //Updates socket_id
        if (error) throw error;
    });
	console.log('2) socket_id= '+socket.id);

	var queryString = "UPDATE users SET room_id = 0 WHERE pseudo = ?";
    connection.query(queryString, [pseudo], function (error, result, fields) {    //Updates socket_id
        if (error) throw error;
		console.log(socket.id+' '+pseudo);
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
			if(result.length>0){
				var room_id = result[0].room_id;
			}

			var queryString = "UPDATE rooms SET n_users = n_users-1 WHERE id = ?";	//Decrementing n_users
			connection.query(queryString, [room_id], function(error, result, fields){
				if (error) throw error;
			});
		});

		var queryString = "UPDATE users SET socket_id = ? WHERE pseudo = ?";
		connection.query(queryString, [socket.id, pseudo], function (error, result, fields) {    //Updates socket_id
			if (error) throw error;
			var room_id;
			var pseudo;
			queryString = "SELECT pseudo, room_id FROM users WHERE socket_id = ?";
			connection.query(queryString, [socket.id], function(error, result, fields){
				console.log('Length='+result.length);
				pseudo = result[0].pseudo;
				room_id = result[0].room_id;

				queryString = "SELECT socket_id FROM users WHERE (room_id = ?) AND (socket_id != ?)";
				connection.query(queryString, [room_id, socket.id], function(error, result, fields){    //Selects other user's socket_id in the room
					if (error) throw error;
					console.log('length='+result.le)
					for(var i=0; i<result.length; i++){
						socket.to(result[i].socket_id).emit('userLeft', {'pseudo': pseudo, 'room_id': room_id});
					}
				});
			});
		});
    });
});

server.listen(80);
