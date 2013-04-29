var pageWidth = window.innerWidth; //for sizing purposes since there is an issue with %s and the div setup currently - this might be temporary
var pageHeight = window.innerHeight; //same issue as stated above
$(document).ready(function(){
	$('#article-wrapper').css('height', pageHeight*0.8+'px');
	var curArticle = 0; //variable for the current article
  var numArticles = $('.article').size();
	$('.article').css('marginLeft', pageWidth*0.01+"px"); //pageWidth issues in regular css, this a dynamic solution
	$('.article-preview').css('width', pageWidth*0.59+"px");
	
	changeArticle(0,0); //initialize the page -- this is to ensure .animate is modifying consistent attributes
	$('.ui-navbar ul li').live('vclick', function(){  //virtual click detection on the nav bar
		curArticle = $(this).index(); //sets the article to the index of the selected nav bar
		changeArticle(curArticle, 600); //change the article with 600ms wait time --see function below
	});
	
	$('#article-wrapper').live('swipeleft', function(){ //swipeleft event detection
		if(curArticle < numArticles-1){ //if this isn't the last article execute
			changeArticle(++curArticle, 600); //execute the animation
		}
		
	}).live('swiperight', function(){ //swiperight event detection
		if(curArticle > 0){  //if the isn't the first article execute
			changeArticle(--curArticle, 600);//execute the animation
		}
	});
});

function changeArticle(current, speed){ //defining the function that will be used above
	var next = current+1; //define adjacent divs
	var prev = current-1; //define adjacent divs
	
	$('.article').stop().animate({/*opacity: 0.1,*/ 'width' : pageWidth*0.04+'px', 'height' : '50%', 'marginTop' : pageHeight*0.25+'px' },speed); //this is for all articles that aren't adjacent or current
	$('.article:eq('+current+')').stop().animate({/*opacity: 1,*/ 'width' : pageWidth*0.59+'px', 'height' : '100%', 'marginTop' : '0px'},speed); //this is for the primary article
	$('.article:eq('+next+') ,.article:eq('+prev+')').stop().animate({/*opacity: 0.5,*/ 'width' :  pageWidth*0.14+'px', 'height' : '80%', 'marginTop' : pageHeight*0.1+'px'},speed); //this is for adjacent articles
	if(current == 0) //if this is the first article then it is a special case because there are no divs to the left which out other computer relys on.
		$('#article-wrapper').stop().animate({'marginLeft' : (pageWidth*.2)-15+'px'},speed); //starting position is 20% of pagewidth -15px
	else
		$('#article-wrapper').stop().animate({'marginLeft' : pageWidth*((current*-.05)+.10)-15+'px'},speed); //modify 5% of page width per article + 10% for the adjacent articel width and -15px fo rpadding
  }