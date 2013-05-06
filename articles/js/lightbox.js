$(function(){
  $('#image-display').live('vclick', function(){
    $('body').bind('touchmove', function(e){e.preventDefault()});
    var posTop = $(window).scrollTop();
    var lb_img = $(this).css('background-image');
        lb_img = lb_img.replace('url(','').replace(')','');
    $('body').append('<div id="lb_overlay"></div>');
    $('body').append('<div id="lb">'+
            '<a href="#" id="lb_close"><br />'+
            '<img class="lb_image" src="' + lb_img + '" />'+
            '<img id="close" src="images/closebox.png" /></a></div>');

    $('#lb_overlay').css('top', posTop + 'px');

    $('#lb_overlay').fadeTo(500, 0.75, function(){
      $('#lb').fadeTo(250, 1);
    });

   $('#lb_overlay, #lb, #lb_close').live('vclick', function(e){
     e.preventDefault();
      $('#lb').fadeTo(100, 0, function(){
        $(this).remove();
      $('#lb_overlay').fadeTo(250, 0, function(){
        $(this).remove();
      });
    });
    $('body').unbind('touchmove');
  });
  });
});
