
var socket = io.connect('192.168.0.156');  //enable connection with the server
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

  $("div.header.settings#settings").on('click', () => {
    let cookies = document.cookie.split(";");
    for(var i=0; i < cookies.length; i++) {
      let equals = cookies[i].indexOf("=");
      let name = equals > -1 ? cookies[i].substr(0, equals) : cookies[i];
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    location.reload();
  })
