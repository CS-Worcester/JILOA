$(document).ready(function(){
  var imageRows = $('div.image-row').size(); //Returns the number of image rows
  
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
	var parentIndex = $(this).parent().attr('id'); //get the parent index which tells us the row to modify
	var scrollIndex = $(this).attr('image'); //gets the image we want to scroll to
	$('div.image-row:eq('+parentIndex+')').animate({ 'marginLeft': -scrollIndex*545+'px'}, 1000); //scoll by modifying the margin, animation length 1000ms
  });
  
  $('.image-selector').click(function(){ //when the user clicks on the div around the links (this includes clicking on a link) it preforms this function
    var rowIndex = $(this).attr('id'); //get the row index (same as previous function)
	$('#row-wrapper').animate({ 'marginTop': -rowIndex*420+'px'},1000); //animates based on row height for 1000ms
	$('div.image-row:gt('+rowIndex+'),div.image-row:lt('+rowIndex+')').animate({ 'marginLeft' : "0px"} , 1000); //resets all other rows to the first image
  });
  
});