$(function() {
	var currentVal = 0;
	var imageUrl = "images/image1_";
	$('#slider').on("change", function(event){
	  if($(this).val() != currentVal){
		currentVal = $(this).val();
		$('#image-viewer').css('background-image', 'url(' + imageUrl+currentVal +'.jpg)').text(currentVal);
	  }
	});
});