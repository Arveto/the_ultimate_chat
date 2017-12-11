if (typeof Message === 'undefined'){

  var Message = {

    send: (message) => {    //when hit enter key, send message

      socket.emit('message', message);

      //display locally
      $("<p>").html(message).appendTo('.current#messages').addClass("message mine");
      $("textarea").val('');

      Message.scroll();
    },


    disp: (pseudo, content, time) => {    //on 'message' event, display it

    var re = new RegExp('[; ]username=([^\\s;]*)');
    var login = (' '+document.cookie).match(re);

      if(pseudo == login[1]){
        $("<p>").html(content).appendTo('.current#messages').addClass("message mine");
      } else {
      $("<span>").html("<strong>"+pseudo+"</strong> "+time).appendTo('.current#messages');
      $("<p>").html(content).appendTo('.current#messages').addClass("message not_mine");
      }

      Message.scroll();
    },

    chatEvent : (type, content) => {  // content : object with arguments
      if (type == "newEntrant") {
        let pseudo = content.pseudo;
        $("<p>").html("Please welcome a new challenger : " + pseudo + " !").appendTo(".current#messages").addClass("chatEvent");
      }

      if (type == "userLeft") {
        let pseudo = content.pseudo;
        $("<p>").html(pseudo + " left the room").appendTo(".current#messages").addClass("chatEvent");
      }
    }

    scroll: function () {
        console.log("scroll");
	          $( "div.current#messages" ).scrollTop( $("div.current#messages").height() + $(window).height() );
    }

  };

} else {
  console.log("'message' namespace already exist");
}
