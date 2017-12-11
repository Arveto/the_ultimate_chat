
var socket = io.connect('http://192.168.0.156');  //enable connection with the server



 socket.on('room', (room) => {    //get rooms list
   room = new Room(room.num, room.roomName, room.entrants);
   room.disp();
 });

  socket.on('message', (message) => {       //display inners messages
    Message.disp(message.pseudo, message.content, message.timestamp);
  });

  socket.on('newUser', (entrant) => {
    newEntrant(entrant.pseudo)
    Message.chatEvent("newEntrant", entrant);
  })

  socket.on('userLeft', (entrant)) => {
    userLeft(entrant.pseudo);
    Message.chatEvent('userLeft', entrant)
  }

  socket.on('usersList', (entrants) => {
      $("div#entrantsList .entrant").remove();
    if (Array.isArray(entrants)){
        for(let i = 0; i < entrants.length; i++){
            newEntrant(entrants[i].pseudo)
        }
    }
  });

  $("textarea").on('keypress', (e) => {     //send messages
    if ( e.keyCode == 13 ) {  //enter key
      e.preventDefault();
      Message.send( $("textarea").val() );
    }
  });
