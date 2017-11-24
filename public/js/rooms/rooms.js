
var color=0;
var Room = function (num, roomName, entrants) {  //Room constructor
  this.num = num;
  this.roomName = roomName;
  this.entrants = entrants;

  this.disp = function () {
    let div = $('<div>').addClass('room').html('<strong>'+this.roomName+'</strong><span class="entrants">'+this.entrants+' entrants</span>').appendTo('#roomsList');
    div.attr('id', this.num);
    div.css('background-color', getColor("room") );

    $(".room:last").on('click', function () {     //event 'onclick' => send new room to the server
      socket.emit('leaveRoom');

      let roomId = this.id;
      socket.emit('joinRoom', roomId);      //server emits 'usersList' event
    });
  };

  if(i>=4){
    i++;
  } else {
    i=0
  }
};

var j=0;
function changeRoom(pseudo) {
  $("div#entrants").empty();
  $("div#messages").empty();

  let div = $('<div>').addClass('entrant').html('<strong>'+pseudo+'</strong>').appendTo('#entrantsList');
  div.css('background-color', getColor("entrant") );

  if(i>=4){
    i++;
  } else {
    i=0
  }
}

function getColor(target) {
  let room = ['ca4e4e', 'c8794e', 'c9994d', 'c9b64d', 'c3c94f'];
  let entrant = ['a7baff', 'b8b8ff', 'd0c2ff', 'ddbdfe', 'edbaff'];

  if(target == "room"){
    let color = '#' + room[color];
  } else {
    let color = '#' + entrant[color];
  }
  return color;
}
