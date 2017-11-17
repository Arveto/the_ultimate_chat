
//messages

$("textarea").on('keypress', (e) => {
  if ( e.keyCode == 13 ) {  //enter key
    e.preventDefault();
    message.send( $("textarea").val() );
  }
});
