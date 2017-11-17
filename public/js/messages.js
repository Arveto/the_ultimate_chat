
var message = {
  send: function (message) {
    // TODO: parser

    // TODO: send it
    socket.emit('message', {message: $('textarea').val()})

    //display locally
    $("<p>").html(message).insertBefore("p.message:first").addClass("message mine");
    $("textarea").val('');
  }
}
