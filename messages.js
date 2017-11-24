
if (typeof Message === 'undefined'){

  var Message = {

    send: (message) => {    //when hit enter key, send message

      socket.emit('message', message);

      //display locally
      console.log("send message : " + message);
      $("<p>").html(message).appendTo('.current#messages').addClass("message mine");
      $("textarea").val('');
    },


    disp: (pseudo, content, time) => {    //on 'message' event, display it

    console.log("message rescived : " + content);

      $("<p>").html(content).appendTo('.current#messages').addClass("message not_mine");
      $("<span>").html("<strong>"+pseudo+"</strong> "+time).appendTo('.current#messages');
    }
  };

} else {
  console.log("'message' namespace already exist");
}
