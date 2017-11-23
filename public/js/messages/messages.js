
if (typeof Message === 'undefined'){

  var Message = {

    send: (message) => {    //when hit enter key, send message

      socket.emit('message', {message: $('textarea').val()});

      //display locally
      $("<p>").html(message).insertBefore("p.message:first").addClass("message mine");
      $("textarea").val('');
    },


    disp: (pseudo, content, time) => {    //on 'message' event, display it

      $("<p>").html(content).insertBefore("p.message:first").addClass("message not_mine");
      $("<span>").html("<strong>"+pseudo+"</strong> "+time).insertBefore("p.message:first");
    }
  };

} else {
  console.log("'message' namespace already exist");
}
