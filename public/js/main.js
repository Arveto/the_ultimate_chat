
var socket = io.connect('http://localhost');  //enable connection with the server



 socket.on('room', (room) => {    //get rooms list
   room = new Room(room.num, room.roomName, room.entrants);
   room.disp();
 });
  
  socket.on('message', (message) => {       //display inners messages      //TOADD
    message.disp(message.pseudo, message.content, message.timestamp);
  });
  
  socket.on('usersList', (entrants) => {
    entrants.forEach(entrant => {
      changeRoom(entrant);
    });
  });

  $("textarea").on('keypress', (e) => {     //send messages
    if ( e.keyCode == 13 ) {  //enter key
      e.preventDefault();
      message.send( $("textarea").val() );
    }
  });
