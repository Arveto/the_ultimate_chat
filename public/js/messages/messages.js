
if (typeof message === 'undefined'){

  var message = {

    send: (message) => {    //when hit enter key, send message

      socket.emit('message', {message: $('textarea').val()});

      //display locally
      $("<p>").html(message).insertBefore("p.message:first").addClass("message mine");
      $("textarea").val('');
    },


    disp: (content, pseudo, time) => {    //on 'message' event, display it

      $("<span>").html("<strong>"+pseudo+"</strong> "+time).insertBefore("p.message:first");
      $("<p>").html(content).insertBefore("span:first").addClass("message not_mine");
    }
  };

} else {
  console.log("'message' namespace already exist");
}
