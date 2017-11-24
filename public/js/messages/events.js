
$("textarea").on('keypress', (e) => {     //send messages
  if ( e.keyCode == 13 ) {  //enter key
    e.preventDefault();
    if ($("textarea").val()){
      Message.send( $("textarea").val() );
    }
  }
});

socket.on('message', (message) => {       //display inners messages
  Message.disp(message.pseudo, message.content, message.timestamp);
});
