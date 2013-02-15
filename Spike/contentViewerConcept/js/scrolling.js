$(document).ready(function(){
  var imageRows = $('div.image-row').size(); //Returns the number of image rows
  var currentRow = 0;
  var currentImage = 0;
  
  for(var i = 0;i<imageRows;i++){  //populate the div image-rows with the number of children as an attribute "images" for easier reference
	$('div.image-row:eq('+i+')').attr('images',$('div.image-row:eq('+i+')').children('img').size()); //get the number of img children
	$('.image-selector:eq('+i+')').attr('id',i); //find the image selectors and assign them an image row save the row under the id attribute
		for(var j = 0; j < $('div.image-row:eq('+i+')').attr('images'); j++){ //populate the div with the respective number of links
			$('.image-selector:eq('+i+')').append('<a image='+j+'>['+j+']</a> '); //here is where the link content goes
		}
  }
  //image row information parsing and application is complete at this point
  
  
  /*
	Functions to handle image movement
  */
  $('.image-selector a').click(function(){ //when the user clicks the numerical link under the "image selector" it will preform this function
  console.log('image-selector a clicked');
  console.log(':: Start----------\n:: Current Image = '+currentImage+'\n:: Current Row'+currentRow+'\n');
	currentRow = $(this).parent().attr('id'); //get the parent index which tells us the row to modify
	currentImage = $(this).attr('image'); //gets the image we want to scroll to
	$('div.image-row:eq('+currentRow+')').animate({ 'marginLeft': -currentImage*545+'px'}, 1000); //scoll by modifying the margin, animation length 1000ms
  console.log(':: Finish----------\n:: Current Image = '+currentImage+'\n:: Current Row'+currentRow+'\n');
  });
  
  $('.image-selector').click(function(){ //when the user clicks on the div around the links (this includes clicking on a link) it preforms this function
  console.log('image-selector clicked');
  console.log(':: Start----------\n:: Current Image = '+currentImage+'\n:: Current Row'+currentRow+'\n');
      $('#row-wrapper').animate({ 'marginTop': -$(this).attr('id')*420+'px'},1000); //animates based on row height for 1000ms
      if(currentRow){ //get the row index (same as previous function)
        currentRow = $(this).attr('id');
        $('div.image-row:gt('+currentRow+'),div.image-row:lt('+currentRow+')').animate({ 'marginLeft' : "0px"} , 1000); //resets all other rows to the first image
    }
  console.log(':: Finish----------\n:: Current Image = '+currentImage+'\n:: Current Row'+currentRow+'\n');
  });
  /*
	Testing Swip Function -- "I don't know if this works yet because I do not have a platform to test it on"-Joe
	The concept is that if a user swipes it will animate the slide by 1 in either direction, if the row is at the end or begining respectively it will 
	make an animation that looks like it was trying to go, this was something i just thought would look nice
  */
  
  $('.image-row').live("swipeleft", function(){
    console.log('image-row swipeleft');
    console.log(':: Start----------\n:: Current Image = '+currentImage+'\n:: Current Row'+currentRow+'\n');
    if(currentImage+1 < $(this).attr('images')){ //get the number of images and compare it to what the last image margin would express
      currentImage++;
      $(this).animate({ 'marginLeft': currentImage*-545+'px'}, 1000);
    }
    else{ //Otherwise execute the bounceback animation
      $(this).animate({ 'marginLeft': (currentImage*-545)-200+'px'}, 250).animate({'marginLeft': currentImage*-545+'px'}, 250);
    }
    console.log(':: Finish----------\n:: Current Image = '+currentImage+'\n:: Current Row'+currentRow+'\n');
  });
	
	$('.image-row').live("swiperight", function(){
    console.log('image-row swiperight');
    console.log(':: Start----------\n:: Current Image = '+currentImage+'\n:: Current Row'+currentRow+'\n');
    if(currentImage == 0){
      $(this).animate({ 'marginLeft': '200px'}, 250).animate({ 'marginLeft': '0px'}, 250); 
    }
    else{ //if the current margin is lt 0 then it can be swiped right
      currentImage--;
      $(this).animate({ 'marginLeft': currentImage*-545+'px'}, 1000); //execute animation
      }
    console.log(':: Finish----------\n:: Current Image = '+currentImage+'\n:: Current Row'+currentRow+'\n');
	});
});
  
