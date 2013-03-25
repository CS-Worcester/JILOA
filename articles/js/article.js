$(document).ready(function(){
  //var imageRows = $('div.image-row').size(); //Returns the number of image rows
  var currentRow = 0; //starts at 0 by default --created so clicking image-selector links could work with swipe functions
  var imageHeight = 440; //pre-define image heigh --used in animations 
  var animationTime = 1000; //pre-defined animation time --used in animations
  /* Dynamic population of links and attributes that hold data required
      Image Rows indexes and the number of images in a row etc.
      costly but usefull for potential dynamic values
  */
	$('#image-display').css('height', window.innerHeight*0.8+'px');
	var scrollSwap = ($('.ui-page').height()-window.innerHeight)/5;
	var height = $('#article-display p:eq(0)').height();
	var width = $('#article-display p').width();
	var top = $('#article-display p:eq(0)').position().top;
	var left = $('#article-display p:eq(0)').position().left;
	$('#active').css({'top' : top+'px',
					 'left' : left-12+'px',
					 'width' : width+25+'px',
					 'height' : (height+25)+'px'});
	
  $(window).scroll(function(){
  	if($(window).scrollTop() < scrollSwap  && currentRow != 0){
		//$('#article-display p').removeClass('active');
		currentRow = 0;
		//$('#article-display p:eq('+currentRow+')').addClass('active');
		$('#active').stop().animate({'top' : $('#article-display p:eq('+currentRow+')').position().top+5+'px',
					 'height' : ($('#article-display p:eq('+currentRow+')').height()+20)+'px'}, animationTime);
		slideY($('#row-wrapper'), -currentRow*imageHeight, animationTime);
	}  
  	else if($(window).scrollTop() >= scrollSwap  && $(window).scrollTop() < scrollSwap*2 && currentRow != 1){
		//$('#article-display p').removeClass('active');
		currentRow = 1;
		//$('#article-display p:eq('+currentRow+')').addClass('active');
		$('#active').stop().animate({'top' : $('#article-display p:eq('+currentRow+')').position().top+5+'px',
					 'height' : ($('#article-display p:eq('+currentRow+')').height()+20)+'px'}, animationTime);
		slideY($('#row-wrapper'), -currentRow*imageHeight, animationTime);
	}
  	else if($(window).scrollTop() >= scrollSwap*2 && $(window).scrollTop() < scrollSwap*3 && currentRow != 2){
		//$('#article-display p').removeClass('active');
		currentRow = 2;
		//$('#article-display p:eq('+currentRow+')').addClass('active');
		$('#active').stop().animate({'top' : $('#article-display p:eq('+currentRow+')').position().top+5+'px',
					 'height' : ($('#article-display p:eq('+currentRow+')').height()+20)+'px'}, animationTime);
		slideY($('#row-wrapper'), -currentRow*imageHeight, animationTime);
	}
  	else if($(window).scrollTop() >= scrollSwap*3 && $(window).scrollTop() < scrollSwap*4 && currentRow != 3){
		//$('#article-display p').removeClass('active');
		currentRow = 3;
		//$('#article-display p:eq('+currentRow+')').addClass('active');
		$('#active').stop().animate({'top' : $('#article-display p:eq('+currentRow+')').position().top+5+'px',
					 'height' : ($('#article-display p:eq('+currentRow+')').height()+20)+'px'}, animationTime);
		slideY($('#row-wrapper'), -currentRow*imageHeight, animationTime);
	}
  	else if($(window).scrollTop() >= scrollSwap*4 && currentRow != 4){
		//$('#article-display p').removeClass('active');
		currentRow = 4;
		//$('#article-display p:eq('+currentRow+')').addClass('active');
		$('#active').stop().animate({'top' : $('#article-display p:eq('+currentRow+')').position().top+5+'px',
					 'height' : ($('#article-display p:eq('+currentRow+')').height()+20)+'px'}, animationTime);
		slideY($('#row-wrapper'), -currentRow*imageHeight, animationTime);
	}
  });
});
  
  /*
	Animation Functions
  */

  function slideY(object, dist, speed){ //Slide on the Y axis using margin
    object.stop().animate({'marginTop' : dist+'px'}, speed);
  }