
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