exports.events = function(socket, connection){
        //The user is logged in and needs to see the rooms list
    socket.on('requireRooms',function(){
        var queryString = 'SELECT name, id, n_users FROM rooms';
        connection.query(queryString, function (error, result, fields) {    //Selects avalaible rooms
            if(error){
                console.log('Error in getting rooms list');
            }
            socket.emit('rooms', result);
        });
    });


        //The user enters a room
    socket.on('joinRoom', function(id){
        /*The users's room is gonna be updated, he's gonna receive a list of connected users and the last 20 messages.
        The room n_user will be incremented. The previoulsy connected users will receive a notice informing them about the new user.*/

        queryString = "UPDATE users SET room_id = ? WHERE socket_id = ?";
        connection.query(queryString, [id, socket.id], function(error, result, fields){  //Update user's 'room_id'
            if(error){
                console.log('Error in updating user\'s room:\n'+error);
            }
        });

        queryString = "UPDATE rooms SET n_users = n_users+1 WHERE id = ?";
        connection.query(queryString, [id], function(error, result, fields){  //Update room's 'n_users';
            if(error){
                console.log('Error n_users for the room:\n'+error);
            }
        });

        queryString = "SELECT content, sender_id, timestamp FROM messages WHERE room_id = ? ORDER BY id ASC LIMIT 20";
        connection.query(queryString, [id], function(error, result, fields){  //Select last 20 messages
            if(error){
                console.log('Error in selecting last messages:\n'+error);
            }
            else{
                var message;
                for(var i=0; i<result.length; i++){
                    message = result[i];
                    socket.emit('message', message);   //The new user is receiving last messages.
                }
            }
        });

        queryString = "SELECT pseudo, id FROM users WHERE room_id = ?";
        connection.query(queryString, [id], function(error, result, fields){  //Select users list
            if(error){
                console.log('Error in getting connected users:\n'+error);
            }
            else{
                socket.emit('usersList', result); //The new user is receiving users list.
            }
        });

        queryString = "SELECT pseudo, room_id FROM users WHERE socket_id = ?";   //Selecting user's infos
        connection.query(queryString, [socket.id], function(error, result, fields){
            var pseudo = result.pseudo;
            var room_id = result.room_id;

            queryString = "SELECT socket_id FROM users WHERE (room_id = ?) AND (socket_id != ?)";    //Selecting other room members
            connection.query(queryString, [room_id, socket.id], function(error, result, fields){
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
            if(error){
                console.log('Error in inserting message to table:\n'+error);
            }
        });

        queryString = "SELECT pseudo FROM users WHERE socket_id = ?";   //Send 'message' event to other users
        connection.query(queryString, [socket.id], function(error, result, fields){   //Get user's pseudo
            var pseudo = result.pseudo;

            queryString = "SELECT socket_id FROM users WHERE room_id = (SELECT room_id FROM users WHERE socket_id = ?) AND socket_id != ?";
            connection.query(queryString, [socket.id, socket.id], function(error, result, fields){    //Selects other user's socket_id in the room
                for(var i=0; i<result.length; i++){
                    socket.to(result.socket_id).emit('message', {'content': content, 'pseudo': pseudo, 'timestamp': timestamp});  //Sends parameters as JSONs to be treated the same way clientside
                }
            });
        });
    });

    //TODO Leave room event (Send disconnection event to other users, update user's room_id to Null)
    //socket.on('leaveRoom')

        //The user leaves the room
}

    //TODO Disconnection event (socket_io, room to NULL)
