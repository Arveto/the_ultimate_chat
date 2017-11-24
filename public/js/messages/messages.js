
if (typeof Message === 'undefined'){

  var Message = {

    send: (message) => {    //when hit enter key, send message

      socket.emit('message', message);

      //display locally
      $("<p>").html(message).appendTo('.current#messages').addClass("message mine");
      $("textarea").val('');
    },


    disp: (pseudo, content, time) => {    //on 'message' event, display it

      if(pseudo == document.cookie.replace(/(?:(?:^|.*;\s*)pseudo\s*\=\s*([^;]*).*$)|^.*$/, "$1")){
        $("<p>").html(message).appendTo('.current#messages').addClass("message mine");
      } else {
      $("<span>").html("<strong>"+pseudo+"</strong> "+time).appendTo('.current#messages');
      $("<p>").html(content).appendTo('.current#messages').addClass("message not_mine");
      }
    }
  };

} else {
  console.log("'message' namespace already exist");
}
