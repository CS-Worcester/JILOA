$(document).ready(function(){
  //var imageRows = $('div.image-row').size(); //Returns the number of image rows
  var currentRow = 0; //starts at 0 by default --created so clicking image-selector links could work with swipe functions
  var currentImage = 0; //starts at 0 by default --created so clicking image-selector links could work with swipe functions
  var imageHeight = 570; //pre-define image heigh --used in animations 
  var imageWidth = 545; //pre-defined image width --used in animations
  var animationTime = 1000; //pre-defined animation time --used in animations
  /* Dynamic population of links and attributes that hold data required
      Image Rows indexes and the number of images in a row etc.
      costly but usefull for potential dynamic values
  */
  
	checkArrow();
		
  for(var i = 0;i<$('div.image-row').size();i++){
	$('div.image-row:eq('+i+')').attr('images',$('div.image-row:eq('+i+')').children('img').size());
	$('.image-selector:eq('+i+')').attr('row',i);
		for(var j = 0; j < $('div.image-row:eq('+i+')').attr('images'); j++){
			$('.image-selector:eq('+i+')').append('<a data-role="button" class="image-btn" image='+j+'>'+j+'</a> ');
		}
  }
  
  $(window).scroll(function(){
  	if($(window).scrollTop() < $('p[row=1]').position().top && currentRow != 0){
		currentRow = 0;
		currentImage = 0;
		checkArrow();
		slideY($('#row-wrapper'), -currentRow*imageHeight, animationTime);
		slideX($('div.image-row:gt('+currentRow+'),div.image-row:lt('+currentRow+')'), 0, animationTime);
	}  
  	else if($(window).scrollTop() >= $('p[row=1]').position().top && $(window).scrollTop() <= $('p[row=2]').position().top && currentRow != 1){
		currentRow = 1;
		currentImage = 0;
		checkArrow();
		slideY($('#row-wrapper'), -currentRow*imageHeight, animationTime);
		slideX($('div.image-row:gt('+currentRow+'),div.image-row:lt('+currentRow+')'), 0, animationTime);
	}
  	else if($(window).scrollTop() >= $('p[row=2]').position().top && $(window).scrollTop() <= $('p[row=3]').position().top && currentRow != 2){
		currentRow = 2;
		currentImage = 0;
		checkArrow();
		slideY($('#row-wrapper'), -currentRow*imageHeight, animationTime);
		slideX($('div.image-row:gt('+currentRow+'),div.image-row:lt('+currentRow+')'), 0, animationTime);
	}
  	else if($(window).scrollTop() >= $('p[row=3]').position().top && currentRow != 3){
		currentRow = 3;
		currentImage = 0;
		checkArrow();
		slideY($('#row-wrapper'), -currentRow*imageHeight, animationTime);
		slideX($('div.image-row:gt('+currentRow+'),div.image-row:lt('+currentRow+')'), 0, animationTime);
	}
  });
  
	//-----------------------------
	//      Button Transitions
	//-----------------------------
  $('.image-btn').live('vclick', function(){ //removed old functions due to not being touch compatable
	if($(this).closest('.image-selector').attr('row') != currentRow){
		currentRow = $(this).closest('.image-selector').attr('row');
		slideY($('#row-wrapper'), -$(this).closest('.image-selector').attr('row')*imageHeight, animationTime);
		slideX($('div.image-row:gt('+currentRow+'),div.image-row:lt('+currentRow+')'), 0, animationTime);
	}
	currentImage = $(this).attr('image');
	slideX($('div.image-row:eq('+currentRow+')'), -currentImage*imageWidth, animationTime);
	checkArrow();
  });

	//-----------------------------
	//       Swipe Transitions
	//-----------------------------
  $('.image-row').live("swipeleft", function(){ //Swipe left event
    if(currentImage < $(this).attr('images')-1){
      currentImage++;
      slideX($(this), -currentImage*imageWidth, animationTime);
    }
    else{
      slideX($(this), (currentImage*-imageWidth)-(imageWidth/4), animationTime/4);
      slideXQueue($(this), (currentImage*-imageWidth), animationTime/4);
    }
	checkArrow();
  }).live("swiperight", function(){ //Swipe right event
    if(currentImage == 0){
      slideX($(this), imageWidth/4, animationTime/4);
      slideXQueue($(this), 0, animationTime/4);
    }
    else{ 
      currentImage--;
      slideX($(this), currentImage*-imageWidth, animationTime);
    }
	checkArrow();
	});
	
    function checkArrow(){
		$('#left-arrow,#right-arrow').animate({opacity: 0.50}, 0);
		if(currentImage == 0){
			$('#left-arrow').animate({opacity: 0.05}, 0);
			}
		if(currentImage == $('div.image-row:eq('+currentRow+')').attr('images')-1){
			$('#right-arrow').animate({opacity: 0.05}, 0);
			}
	}
  });
  
  /*
	Animation Functions
  */

  function slideX(object, dist, speed){ //Slide on the X axis using margin
    object.stop().animate({'marginLeft' : dist+'px'}, speed);
  }
  function slideXQueue(object, dist, speed){ //used for bounceback effect, this is the original slide function
	object.animate({'marginLeft' : dist+'px'}, speed);
  }
  function slideY(object, dist, speed){ //Slide on the Y axis using margin
    object.stop().animate({'marginTop' : dist+'px'}, speed);
  }