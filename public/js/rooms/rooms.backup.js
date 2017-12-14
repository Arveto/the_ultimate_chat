

var Room = function (id, roomName, entrants) {  //Room constructor
  this.num = Math.random();
  this.roomName = roomName;
  this.nb_entrants = entrants.length;
  this.entrants = entrants;

  this.disp = function () {
    let div = $('<div>').addClass('room').html('<strong>'+this.roomName+'</strong><span class="entrants">'+this.nb_entrants+' entrants</span>').appendTo('#roomsList');
    div.attr('id', "room_"+this.num)
    div.css('background-color', getRandomColor() );

    $(".room:last").on('click', function () {     //event 'onclick' => send new room to the server
      // socket.emit('changeRoom', this.id);  //TOADD
      console.log("change room to : " + this.id);
      console.log(this.entrants)
  //display selected room's entrants
  //XXX : normally, the server respond with the room's entrants list      
      changeRoom(this.entrants);
    });
  };
};


function changeRoom (entrants) {

  $("div").remove(".entrant");

  entrants.forEach(entrant => {
    let div = $('<div>').addClass('entrant').html('<strong>'+entrant+'</strong>').appendTo('#entrantsList');
    div.css('background-color', getRandomColor() );
  });
};

function getRandomColor() {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}