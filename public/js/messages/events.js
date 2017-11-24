
$("textarea").on('keypress', (e) => {     //send messages
  if ( e.keyCode == 13 ) {  //enter key
    e.preventDefault();
    if ($("textarea").val()){
      Message.send( $("textarea").val() );
    }
  }
});
