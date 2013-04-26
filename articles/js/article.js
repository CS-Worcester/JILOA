$(document).ready(function(){
  //var imageRows = $('div.image-row').size(); //Returns the number of image rows
  var currentRow = 0; //starts at 0 by default --created so clicking image-selector links could work with swipe functions
  var currentImage = 0; //starts at 0 by default --created so clicking image-selector links could work with swipe functions
  var imageHeight = 550; //pre-define image heigh --used in animations 
  var imageWidth = 550; //pre-define image width --used in animations 
  var animationTime = 1000; //pre-defined animation time --used in animations
  /* Dynamic population of links and attributes that hold data required
      Image Rows indexes and the number of images in a row etc.
      costly but usefull for potential dynamic values
  */
	$('#image-display').css('height', window.innerHeight*0.8+'px');
  var numRow = $('#article-display p').size();
	var scrollSwap = ($('.ui-page').height()-window.innerHeight)/numRow;
	var height = $('#article-display p:eq(0)').height();
	var width = $('#article-display p').width();
	var top = $('#article-display p:eq(0)').position().top;
	var left = $('#article-display p:eq(0)').position().left;
	$('#active').css({'top' : top+10+'px',
					 'left' : left-12+'px',
					 'width' : width+25+'px',
					 'height' : (height+15)+'px'});
	
  if(scrollSwap <= 0){
    $('#article-display p').on('vclick', function(){
      currentRow = $(this).index();    
      animateActive();
      slideY($('#row-wrapper'), -currentRow*imageHeight, animationTime);
      currentImage = 0; 
      checkArrow();
    });
  }
  else{
    $(window).scroll(function(){
      if($(window).scrollTop() >= $('.ui-page').height()-window.innerHeight){ //potential null value if numRow does not divide nicely into the page height-windowInnerView
        currentRow = numRow-1;
        animateActive();
        slideY($('#row-wrapper'), -currentRow*imageHeight, animationTime);
      }
      else if(currentRow != Math.floor(($(window).scrollTop())/scrollSwap)){
        currentRow = Math.floor($(window).scrollTop()/scrollSwap);
        animateActive();
        slideY($('#row-wrapper'), -currentRow*imageHeight, animationTime);
      }
       currentImage = 0;
       checkArrow();       
    });
    
    
    $('#article-display p').on('vclick', function(){
      currentRow = $(this).index();
      $("html, body").stop().animate({ scrollTop: (currentRow*scrollSwap)+numRow+'px' });
       currentImage = 0; 
       checkArrow();
    });
    
    $('.image-row').live("swipeleft", function(){ //Swipe left event
    if(currentImage < $('div.image-row:eq('+currentRow+') img').size()-1){
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
    
    function animateActive(){
    $('#active').stop().animate({'top' : $('#article-display p:eq('+currentRow+')').position().top+10+'px',
             'height' : ($('#article-display p:eq('+currentRow+')').height()+15)+'px'}, animationTime);
    }
   }
   function checkArrow(){
		$('#left-arrow,#right-arrow').animate({opacity: 0.50}, 0);
		if(currentImage == 0){
			$('#left-arrow').stop().animate({opacity: 0.05}, 0);
			}
		if(currentImage == $('div.image-row:eq('+currentRow+') img').size()-1){
			$('#right-arrow').stop().animate({opacity: 0.05}, 0);
			}
	}
});
  
  /*
	Animation Functions
  */
  function slideY(object, dist, speed){ //Slide on the Y axis using margin
    object.stop().animate({'marginTop' : dist+'px'}, speed);
  }
  function slideX(object, dist, speed){ //Slide on the X axis using margin
    object.stop().animate({'marginLeft' : dist+'px'}, speed);
  }
  function slideXQueue(object, dist, speed){ //used for bounceback effect, this is the original slide function
	object.animate({'marginLeft' : dist+'px'}, speed);
  }