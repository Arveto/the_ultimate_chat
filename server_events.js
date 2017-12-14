exports.chatEvents = function(socket, connection){

        //The user enters a room
    socket.on('joinRoom', function(id){
        /*The users's room is gonna be updated, he's gonna receive a list of connected users and the last 20 messages.
        The room n_user will be incremented. The previoulsy connected users will receive a notice informing them about the new user.*/

        var lastMessages;
        var pseudos = [];
        queryString = "SELECT content, sender_id, timestamp FROM messages WHERE room_id = ? ORDER BY id ASC LIMIT 20";
        connection.query(queryString, [id], function(error, result, fields){  //Select last 20 messages
            if (error) throw error;
            var lastMessages = result;


            queryString = "SELECT pseudo FROM users WHERE id = ?";
            for(let i=0; i<result.length; i++){ //Select pseudos associated with messages
                connection.query(queryString, [result[i].sender_id], function(error, result, fields){
                    if (error) throw error;
                    socket.emit('message', {'content': lastMessages[i].content, 'pseudo': result[0].pseudo, 'timestamp': lastMessages[i].timestamp});
                });
            }
        });

        queryString = "SELECT pseudo FROM users WHERE room_id = ?";
        connection.query(queryString, [id], function(error, result, fields){  //Select users list
            if (error) throw error;
            socket.emit('usersList', result); //The new user is receiving users list.
        });

        queryString = "SELECT pseudo FROM users WHERE socket_id = ?";   //Selecting user's infos
        connection.query(queryString, [socket.id], function(error, result, fields){
            if (error) throw error;
			var pseudo = result[0].pseudo;

            queryString = "SELECT socket_id FROM users WHERE (room_id = ?) AND (socket_id != ?)";    //Selecting other room members
            connection.query(queryString, [id, socket.id], function(error, result, fields){
                if (error) throw error;
                for(var i=0; i<result.length; i++){
                    socket.to(result[i].socket_id).emit('newUser', {'pseudo': pseudo}); //Sending notice about newcomer
                }
            });
        });

		var queryString = "UPDATE users SET room_id = ? WHERE socket_id = ?";
		connection.query(queryString, [id, socket.id], function(error, result, fields){  //Update user's 'room_id'
			if (error) throw error;
		});

		queryString = "UPDATE rooms SET n_users = n_users+1 WHERE id = ?";
		connection.query(queryString, [id], function(error, result, fields){  //Update room's 'n_users';
			if (error) throw error;
		});

    });


        //A new message is sent by the user
    socket.on('message',function(content){
        /*The message must be added to the 'messages' table,
        and all connected users (except the sender) will get a 'message' event.*/
        var currentTimestamp = Date.now();

        var sender_id;
        var room_id;

        var queryString = "SELECT id FROM users WHERE socket_id = ?";   //Get sender id
        connection.query(queryString, [socket.id], function(error, result, fields){
            if (error) throw error;
			sender_id = result[0].id;


				//XXX Ugly code incoming
            var queryString = "SELECT room_id FROM users WHERE socket_id = ?";  //Get sender room_id
            connection.query(queryString, [socket.id], function(error, result, fields){
                if (error) throw error;
				room_id = result[0].room_id;

                queryString = "INSERT INTO messages (content, sender_id, room_id, timestamp) VALUES (?, ?, ?, ?)";  //Add the message to the database
                connection.query(queryString, [content, sender_id, room_id, currentTimestamp], function(error, result, fields){
                    if (error) throw error;
                });

					//Send 'message' event to other users
      	        queryString = "SELECT pseudo FROM users WHERE socket_id = ?";
      	        connection.query(queryString, [socket.id], function(error, result, fields){   //Get user's pseudo
      	            if (error) throw error;
      	            var pseudo = result[0].pseudo;

      	            queryString = "SELECT socket_id FROM users WHERE (room_id = ?) AND (socket_id != ?)";
      	            connection.query(queryString, [room_id, socket.id], function(error, result, fields){    //Selects other user's socket_id in the room
      					if (error) throw error;

      					socket.emit('test', {'result': result});
      	                for(var i=0; i<result.length; i++){
      	                    socket.to(result[i].socket_id).emit('message', {'content': content, 'pseudo': pseudo, 'timestamp':currentTimestamp});  //Sends parameters as JSONs to be treated the same way clientside
      	                }
      	            });
      	        });
            });
        });
    });


        //The user leaves the room
    socket.on('leaveRoom', function(room_id){
        // Other users are going to receive a notice, the room's n_user and the user's room_id will be updated
		var pseudo;
		console.log('ROOOOM ID='+room_id);

        var queryString = "SELECT pseudo FROM users WHERE socket_id = ?";   //Send 'userLeft' event to other users
        connection.query(queryString, [socket.id], function(error, result, fields){   //Get user's pseudo
            if (error) throw error;
			pseudo = result[0].pseudo;
			console.log('PSEUDO='+pseudo);


            queryString = "SELECT socket_id FROM users WHERE (room_id = ?) AND (socket_id != ?)";
            connection.query(queryString, [room_id, socket.id], function(error, result, fields){    //Selects other user's socket_id in the room
                if (error) throw error;
				console.log('LENGTH='+result.length);
                for(var i=0; i<result.length; i++){
                	socket.to(result[i].socket_id).emit('userLeft', {'pseudo': pseudo, 'room_id': room_id});
                }
            });
    	});
		queryString = "UPDATE rooms SET n_users = n_users-1 WHERE id = ?";	//Decrementing n_users
		connection.query(queryString, [room_id], function(error, result, fields){
			if (error) throw error;
		});

        queryString = "UPDATE users SET room_id = NULL WHERE socket_id = ?"; //Setting user's room to NULL
        connection.query(queryString, [socket.id], function(error, result, fields){
            if (error) throw error;
        });
    });
}
