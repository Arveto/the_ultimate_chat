exports.events = function(socket, connection){
    console.log('User connected');
        //The user is logged in and needs to see the rooms list
    socket.on('requireRooms',function(){
        var queryString = 'SELECT name, id, n_users FROM rooms';
        connection.query(queryString, function (error, result, fields) {    //Selects avalaible rooms
            if (error) throw error;
            socket.emit('rooms', result);
        });
    });


        //The user enters a room
    socket.on('joinRoom', function(id){
        /*The users's room is gonna be updated, he's gonna receive a list of connected users and the last 20 messages.
        The room n_user will be incremented. The previoulsy connected users will receive a notice informing them about the new user.*/

        queryString = "UPDATE users SET room_id = ? WHERE socket_id = ?";
        connection.query(queryString, [id, socket.id], function(error, result, fields){  //Update user's 'room_id'
            if (error) throw error;
        });

        queryString = "UPDATE rooms SET n_users = n_users+1 WHERE id = ?";
        connection.query(queryString, [id], function(error, result, fields){  //Update room's 'n_users';
            if (error) throw error;
        });

        queryString = "SELECT content, sender_id, timestamp FROM messages WHERE room_id = ? ORDER BY id ASC LIMIT 20";
        connection.query(queryString, [id], function(error, result, fields){  //Select last 20 messages
            if (error) throw error;

            var message;
            for(var i=0; i<result.length; i++){
                message = result[i];
                socket.emit('message', message);   //The new user is receiving last messages.
            }
        });

        queryString = "SELECT pseudo, id FROM users WHERE room_id = ?";
        connection.query(queryString, [id], function(error, result, fields){  //Select users list
            if (error) throw error;
            socket.emit('usersList', result); //The new user is receiving users list.
        });

        queryString = "SELECT pseudo, room_id FROM users WHERE socket_id = ?";   //Selecting user's infos
        connection.query(queryString, [socket.id], function(error, result, fields){
            if (error) throw error;
            var pseudo = result.pseudo;
            var room_id = result.room_id;

            queryString = "SELECT socket_id FROM users WHERE (room_id = ?) AND (socket_id != ?)";    //Selecting other room members
            connection.query(queryString, [room_id, socket.id], function(error, result, fields){
                if (error) throw error;
                for(var i=0; i<result.length; i++){
                    socket.to(result[i].socket_id).emit('newUser', {'pseudo': pseudo}); //Sending notice about newcomer
                }
            });
        });
    });


        //A new message is sent by the user
    socket.on('message',function(content, timestamp){
        /*The message must be added to the 'messages' table,
        and all connected users (except the sender) will get a 'message' event.*/

        queryString = "INSERT INTO messages (`content`, `sender_id`, `room_id`) VALUES (?, (SELECT id FROM users WHERE socket_id = ?), (SELECT room_id FROM users WHERE socket_id = ?) )";

        connection.query(queryString, [content, socket.id, socket.id], function(error, result, fields){   //Add the message to the batabase
            if (error) throw error;
        });

        queryString = "SELECT pseudo FROM users WHERE socket_id = ?";   //Send 'message' event to other users
        connection.query(queryString, [socket.id], function(error, result, fields){   //Get user's pseudo
            if (error) throw error;
            var pseudo = result.pseudo;

            queryString = "SELECT socket_id FROM users WHERE room_id = (SELECT room_id FROM users WHERE socket_id = ?) AND socket_id != ?";
            connection.query(queryString, [socket.id, socket.id], function(error, result, fields){    //Selects other user's socket_id in the room
                if (error) throw error;
                for(var i=0; i<result.length; i++){
                    socket.to(result[i].socket_id).emit('message', {'content': content, 'pseudo': pseudo, 'timestamp': timestamp});  //Sends parameters as JSONs to be treated the same way clientside
                }
            });
        });
    });


        //The user leaves the room
    socket.on('leaveRoom', function(){
        // Other users are going to receive a notice, the room's n_user and the user's room_id will be updated

        var queryString = "SELECT pseudo FROM users WHERE socket_id = ?";   //Send 'userLeft' event to other users
        connection.query(queryString, [socket.id], function(error, result, fields){   //Get user's pseudo
            if (error) throw error;
            var pseudo = result.pseudo;

            queryString = "SELECT socket_id FROM users WHERE room_id = (SELECT room_id FROM users WHERE socket_id = ?) AND socket_id != ?";
            connection.query(queryString, [socket.id, socket.id], function(error, result, fields){    //Selects other user's socket_id in the room
                if (error) throw error;
                for(var i=0; i<result.length; i++){
                    socket.to(result[i].socket_id).emit('userLeft', {'pseudo': pseudo});
                }
            });
        });

        queryString = "SELECT room_id FROM users WHERE socket_id = ?";  //Selecting room to update it
        connection.query(queryString, [socket.id], function(error, result, fields){
            if (error) throw error;
            var room_id = result.room_id;

            queryString = "UPDATE rooms SET n_users = n_users-1 WHERE id = ?";
            connection.query(queryString, [room_id], function(error, result, fields){
                if (error) throw error;
            });
        })

        queryString = "UPDATE users SET room_id = NULL WHERE socket_id = ?"; //Setting user's room to NULL
        connection.query(queryString, [socket.id], function(error, result, fields){
            if (error) throw error;
        });
    });

    
    //The user leaves the site
    socket.on('disconnect', function(){
        var queryString = "UPDATE users SET room_id = NULL, socket_id = NULL where socket_id = ?";
        connection.query(queryString, [socket.id], function(error, result, fields){
            if (error) throw error;
            console.log("User left");
        });
    });
}
