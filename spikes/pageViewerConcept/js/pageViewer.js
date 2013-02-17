$(document).ready(function(){
	changeArticle(0,0);
	$('.ui-navbar ul li').live('vclick', function(){ 
		changeArticle($(this).index(), 600);
	});
});

function changeArticle(current, speed){
	var next = current+1;
	var prev = current-1;
	
	$('.article').stop().animate({opacity: 0.1, 'width' : '100px'},speed);
	$('.article:eq('+current+')').stop().animate({opacity: 1, 'width' : '700px'},speed);
	$('.article:eq('+next+') ,.article:eq('+prev+')').stop().animate({opacity: 0.5, 'width' : '200px'},speed);
	if(current == 0)
		$('#article-wrapper').stop().animate({'marginLeft' : 300+'px'},speed*1.5);
	else
		$('#article-wrapper').stop().animate({'marginLeft' : (current*-100)+200+'px'},speed*1.5);
  }