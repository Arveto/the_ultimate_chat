
$("textarea").on('keypress', (e) => {     //send messages
  if ( e.keyCode == 13 ) {  //enter key
    e.preventDefault();
    console.log(typeof message);
    message.send( $("textarea").val() );
  }
});

socket.on('message', (message) => {       //display inners messages
  message.disp(message.pseudo, message.content, message.timestamp);
});
