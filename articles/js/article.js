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
	$('#active').css({'top' : top+10+'px',
					 'left' : left-12+'px',
					 'width' : width+25+'px',
					 'height' : (height+25)+'px'});
	
  $(window).scroll(function(){
		if($(window).scrollTop() == $('.ui-page').height()-window.innerHeight){ //potential null value if numRow does not divide nicely into the page height-windowInnerView
			currentRow = numRow-1;
			animateActive();
			slideY($('#row-wrapper'), -currentRow*imageHeight, animationTime);
		}
		else if(currentRow != Math.floor(($(window).scrollTop())/scrollSwap)){
			currentRow = Math.floor($(window).scrollTop()/scrollSwap);
			animateActive();
			slideY($('#row-wrapper'), -currentRow*imageHeight, animationTime);
		}
	});
  
  function animateActive(){
	$('#active').stop().animate({'top' : $('#article-display p:eq('+currentRow+')').position().top+10+'px',
					 'height' : ($('#article-display p:eq('+currentRow+')').height()+20)+'px'}, animationTime);
  }
  
});
  
  /*
	Animation Functions
  */
  function slideY(object, dist, speed){ //Slide on the Y axis using margin
    object.stop().animate({'marginTop' : dist+'px'}, speed);
  }