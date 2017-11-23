

var Room = function (id, roomName, entrants) {  //Room constructor
  this.num = Math.random();
  this.roomName = roomName;
  this.entrants = entrants;

  this.disp = function () {
    let div = $('<div>').addClass('room').html('<strong>'+this.roomName+'</strong><span class="entrants">'+this.entrants+' entrants</span>').appendTo('#roomsList');
    div.attr('id', "room_"+this.num)
    div.css('background-color', getRandomColor() );

    $(".room:last").on('click', function () {     //event 'onclick' => send new room to the server
      socket.emit('leaveRoom');
      
      let roomId = this.id;
      roomId.replace('room_', '');
      socket.emit('joinRoom', roomId);
    });
  };
};


function changeRoom(entrants) {
  $("div").remove(".entrant");
  $("div#messages").empty();

  entrants.forEach(entrant => {
    let div = $('<div>').addClass('entrant').html('<strong>'+entrant+'</strong>').appendTo('#entrantsList');
    div.css('background-color', getRandomColor() );
  });
}

function getRandomColor() {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}