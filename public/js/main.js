
var socket = io.connect('145.239.157.32');  //enable connection with the server
var currentRoom = 0;


 socket.on('room', (room) => {    //get rooms list
   $("#roomList:not(.site)").remove();
   room = new Room(room.room_id, room.roomName, room.entrants);
   room.disp();
 });

  socket.on('message', (message) => {       //display inners messages
    Message.disp(message.pseudo, message.content, message.timestamp);
  });

  socket.on('newUser', (entrant) => {
    console.log(entrant.pseudo + "have joined");
    newEntrant(entrant.pseudo);
    Message.chatEvent("newEntrant", entrant);
  })

  socket.on('userLeft', (entrant) => {

    console.log(entrant.pseudo + " has left");
    userLeft(entrant.pseudo);
    Message.chatEvent('userLeft', entrant)
  })

  socket.on('usersList', (entrants) => {
    $("div#entrantsList .entrant").remove();
    if (Array.isArray(entrants)){
        for(let i = 0; i < entrants.length; i++){
            newEntrant(entrants[i].pseudo)
        }
    }
  });

  socket.on('test', (result) => {
    console.log(result);
  })

  $("textarea").on('keypress', (e) => {     //send messages
    if ( e.keyCode == 13 ) {  //enter key
      e.preventDefault();
      Message.send( $("textarea").val() );
    }
  });
