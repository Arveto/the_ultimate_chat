
setColors();

$("button#reinitColors").on("click", () => {
  localStorage.clear();
  $(".settings input").trigger('change');
});

$("button#saveTheme").on('click', () => {
  localStorage.colorHeader = $("div.site.header").css("background-color");
  localStorage.colorBackground = $(".chat").css("background-color");
  localStorage.colorText = $("body").css("color");
  localStorage.colorsHeadertext = $(".header#header").css("color");
  localStorage.colorsBackground = $(".chat").css("background-color");
  localStorage.colorsMyMessagesBackground = $(".message.mine").css("background-color");
  localStorage.colorsMyMessagesText = $(".message.mine").css("color");

  var colors = localStorage.getItem("header : " + localStorage.getItem('colorHeader'));

})

function setColors () {
  var colors = localStorage.getItem("header : " + localStorage.getItem('colorHeader'));
  console.log();

  if(colors) {
    $("#header").css('background-color', localStorage.colorHeader);  //header & borders
    $("*:not(input.slider)").css('border-color', localStorage.colorHeader);
    $(".chat").css('background-color', localStorage.colorBackground);  //main background color
    $("body").css('color', localStorage.colorText);  //text color
    $(".header#header").css('color', localStorage.colorsHeadertext); //header text color
    $(".message.mine").css("background-color", localStorage.colorsBackground); //message.mine background
    $(".message.mine").css("color", localStorage.colorsMyMessagesText); //message.mine text color
  }
}

    //header
$(".header #red").on('change', function(){
    $("#header").css('background-color', 'rgb(' + $(this).val() + ', '+ $("#green:last").val() + ', '+ $("#blue:last").val() + ')');
    $("*:not(input.slider)").css('border-color', 'rgb(' + $(this).val() + ', '+ $("#green:last").val() + ', '+ $("#blue:last").val() + ')');
});
$(".header #green").on('change', function(){
    $("#header").css('background-color', 'rgb(' + $("#red:last").val() + ', '+ $(this).val() + ', '+ $("#blue:last").val() + ')');
    $("*:not(input.slider)").css('border-color', 'rgb(' + $("#red:last").val() + ', '+ $(this).val() + ', '+ $("#blue:last").val() + ')');
});
$(".header #blue").on('change', function(){
    $("#header").css('background-color', 'rgb(' + $("#red:last").val() + ', '+ $("#green:last").val() + ', '+ $(this).val() + ')');
    $("*:not(input.slider)").css('border-color', 'rgb(' + $("#red:last").val() + ', '+ $("#green:last").val() + ', '+ $(this).val() + ')');
});

    //background
$(".background #red").on('change', function(){
    $(".chat").css('background-color', 'rgb(' + $(this).val() + ', '+ $("#green:last").val() + ', '+ $("#blue:last").val() + ')');
});
$(".background #green").on('change', function(){
    $(".chat").css('background-color', 'rgb(' + $("#red:last").val() + ', '+ $(this).val() + ', '+ $("#blue:last").val() + ')');
});
$(".background #blue").on('change', function(){
    $(".chat").css('background-color', 'rgb(' + $("#red:last").val() + ', '+ $("#green:last").val() + ', '+ $(this).val() + ')');
});

    //text
$(".text #red").on('change', function(){
    $("body").css('color', 'rgb(' + $(this).val() + ', '+ $("#green:last").val() + ', '+ $("#blue:last").val() + ')');
});
$(".text #green").on('change', function(){
    $("body").css('color', 'rgb(' + $("#red:last").val() + ', '+ $(this).val() + ', '+ $("#blue:last").val() + ')');
});
$(".text #blue").on('change', function(){
    $("body").css('color', 'rgb(' + $("#red:last").val() + ', '+ $("#green:last").val() + ', '+ $(this).val() + ')');
});

    //headertext
$(".headertext #red").on('change', function(){
    $(".header#header").css('color', 'rgb(' + $(this).val() + ', '+ $("#green:last").val() + ', '+ $("#blue:last").val() + ')');
});
$(".headertext #green").on('change', function(){
    $(".header#header").css('color', 'rgb(' + $("#red:last").val() + ', '+ $(this).val() + ', '+ $("#blue:last").val() + ')');
});
$(".headertext #blue").on('change', function(){
    $(".header#header").css('color', 'rgb(' + $("#red:last").val() + ', '+ $("#green:last").val() + ', '+ $(this).val() + ')');
});

    //my messages background
$(".my.messages.background #red").on('change', function(){
    $(".message.mine").css('background-color', 'rgb(' + $(this).val() + ', '+ $("#green:last").val() + ', '+ $("#blue:last").val() + ')');
});
$(".my.messages.background #green").on('change', function(){
    $(".message.mine").css('background-color', 'rgb(' + $("#red:last").val() + ', '+ $(this).val() + ', '+ $("#blue:last").val() + ')');
});
$(".my.messages.background #blue").on('change', function(){
    $(".message.mine").css('background-color', 'rgb(' + $("#red:last").val() + ', '+ $("#green:last").val() + ', '+ $(this).val() + ')');
});

    //my messages text
$(".my.messages #red").on('change', function(){
    $(".message.mine").css('color', 'rgb(' + $(this).val() + ', '+ $("#green:last").val() + ', '+ $("#blue:last").val() + ')');
});
$(".my.messages #green").on('change', function(){
    $(".message.mine").css('color', 'rgb(' + $("#red:last").val() + ', '+ $(this).val() + ', '+ $("#blue:last").val() + ')');
});
$(".my.messages #blue").on('change', function(){
    $(".message.mine").css('color', 'rgb(' + $("#red:last").val() + ', '+ $("#green:last").val() + ', '+ $(this).val() + ')');
});
