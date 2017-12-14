
var roomColor=0;
var Room = function (room_id, roomName, entrants) {  //Room constructor
  this.room_id = room_id;
  this.roomName = roomName;
  this.entrants = entrants;

  this.disp = function () {
    let div = $('<div>').addClass('room').html('<strong>'+this.roomName+'</strong><span class="entrants">'+this.entrants+' entrants</span>').appendTo('#roomsList');
    div.attr('id', this.room_id);
    div.css('background-color', getColor("room") );

    $(".room:last").on('click', function () {     //event 'onclick' => send new room to the server
      if (currentRoom) {

        console.log("CLIC ON " + this.id);

        console.log("left " + currentRoom);
        socket.emit('leaveRoom', currentRoom);

        $("div#messages.current").empty();
      }

      currentRoom = this.id;
      socket.emit('joinRoom', currentRoom);      //server emits 'usersList' event

      console.log("join " + currentRoom);
    });

    socket.on("userLeft", (outgoing) => {
      if (outgoing.room_id == this.room_id) {
        this.entrants --;
      }
    })
  };


  if (roomColor>=4){
    roomColor=0;
  } else {
    roomColor++;
  }
};



var entrantColor=0;
function newEntrant(pseudo) {

  let div = $('<div>').addClass('entrant').html('<strong>'+pseudo+'</strong>').appendTo('#entrantsList');
  div.css('background-color', getColor("entrant") );
  div.attr('id', pseudo);

  if(entrantColor>=4){
    entrantColor=0;
  } else {
    entrantColor++;
  }
}

function userLeft(pseudo) {
  $('div.entrant#' + pseudo).remove();
}

function getColor(target) {
  let room = ['ca4e4e', 'c8794e', 'c9994d', 'c9b64d', 'c3c94f'];
  let entrant = ['a7baff', 'b8b8ff', 'd0c2ff', 'ddbdfe', 'edbaff'];

  if(target == "room"){
    var color = '#' + room[roomColor];
  } else {
    var color = '#' + entrant[entrantColor];
  }
  return color;
}
