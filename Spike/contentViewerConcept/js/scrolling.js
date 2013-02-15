$(document).ready(function(){
  //var imageRows = $('div.image-row').size(); //Returns the number of image rows
  var currentRow = 0; //starts at 0 by default --created so clicking image-selector links could work with swipe functions
  var currentImage = 0; //starts at 0 by default --created so clicking image-selector links could work with swipe functions
  var imageHeight = 420; //pre-define image heigh --used in animations 
  var imageWidth = 545; //pre-defined image width --used in animations
  var animationTime = 1000; //pre-defined animation time --used in animations
  
  /* Dynamic population of links and attributes that hold data required
      Image Rows indexes and the number of images in a row etc.
      costly but usefull for potential dynamic values
  */
  for(var i = 0;i<$('div.image-row').size();i++){
	$('div.image-row:eq('+i+')').attr('images',$('div.image-row:eq('+i+')').children('img').size());
	$('.image-selector:eq('+i+')').attr('id',i);
		for(var j = 0; j < $('div.image-row:eq('+i+')').attr('images'); j++){
			$('.image-selector:eq('+i+')').append('<a image='+j+'>['+j+']</a> ');
		}
  }
  //image row information parsing and application is complete at this point
  
  
  /*
	Functions to handle image movement
  */
  $('.image-selector a').click(function(){ 
	currentRow = $(this).parent().attr('id');
	currentImage = $(this).attr('image');
	slideX($('div.image-row:eq('+currentRow+')'), -currentImage*imageWidth, animationTime);
  });
  
  $('.image-selector').click(function(){
    slideY($('#row-wrapper'), -$(this).attr('id')*imageHeight, animationTime);
    if(currentRow != $(this).attr('id')){
      currentRow = $(this).attr('id');
      currentImage = 0;
      slideX($('div.image-row:gt('+currentRow+'),div.image-row:lt('+currentRow+')'), 0, animationTime);//.animate({ 'marginLeft' : "0px"} , animationTime); //resets all other rows to the first image
    }
  });
  /*
	Testing Swip Function -- "I don't know if this works yet because I do not have a platform to test it on"-Joe
	The concept is that if a user swipes it will animate the slide by 1 in either direction, if the row is at the end or begining respectively it will 
	make an animation that looks like it was trying to go, this was something i just thought would look nice
  */
  
  $('.image-row').live("swipeleft", function(){ //Swipe left event
    if(currentImage < $(this).attr('images')-1){
      currentImage++;
      slideX($(this), -currentImage*imageWidth, animationTime);
    }
    else{
      slideX($(this), (currentImage*-imageWidth)-(imageWidth/2), animationTime/2);
      slideX($(this), (currentImage*-imageWidth), animationTime/2);
    }
  }).live("swiperight", function(){ //Swipe right event
    if(currentImage == 0){
      slideX($(this), imageWidth/2, animationTime/2);
      slideX($(this), 0, animationTime/2);
    }
    else{ 
      currentImage--;
      slideX($(this), currentImage*-imageWidth, animationTime);
    }
	});
  
  });
  function slideX(object, dist, speed){ //Slide on the X axis using margin
      object.animate({'marginLeft' : dist+'px'}, speed);
  }
  function slideY(object, dist, speed){ //Slide on the Y axis using margin
      object.animate({'marginTop' : dist+'px'}, speed);
  }