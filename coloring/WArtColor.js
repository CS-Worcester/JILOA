/*
 * Worcester State University 
 * CS_401 Software Developement 
 * Coloring Team: Jason Hintlian, Beto Luna
 */


//var tool;
var paint = "paint";
var fillBucket = "fillBucket";
var eraser = "eraser";
var sprayPaint = "sprayPaint";
var state = paint;

// coloring scroll book image locations
var statue1 = "assets/1.png";
var statue2 = "assets/2.png";
var statue3 = "assets/3.png";
var statue4 = "assets/4.png";
var statue5 = "assets/5.png";
var statue6 = "assets/6.png";
var statue7 = "assets/7.png";
var blank = "assets/blank.png";

var sizePanelOpen = false;
var colorPanelOpen = false;

// eraser color
var colorWhite = "#FFFFFF";

//size variable
var sizeExtraSmall = 2;
var sizeSmall = 10;
var sizeMedium = 26;
var sizeLarge = 50;
var sizeExtraLarge = 80;
var currentSize = sizeMedium;

// holds the coloring page
var outlineImage = new Image();
var currentPage = statue1;

// color variables
var colorData;
var outlineColorData;
var currentColor = "rgb(0, 0, 0)";
var currentColorR;
var currentColorG;
var currentColorB;

//var currentState = new Red(this);
var myCanvas, layer1, context, context1;

window.onload = window.onresize = function() {
    
    // javascript fix for disabling the ipad panning on canvas;
    function preventBehavior(e)  {
        e.preventDefault(); 
    };

    document.addEventListener("touchmove", preventBehavior, false);
    
    //jquery mobile fix for panning in ios
    $('body').on('touchmove', function(e) {
    e.preventDefault();
    });
 

// color menu
    var canvas1 = document.getElementById('layer2');
    var ctx1 = canvas1.getContext('2d');

// size menu
    var canvas = document.getElementById('layer3');
    var ctx = canvas.getContext('2d');

    // Get the canvas element and its drawing context 
    myCanvas = document.getElementById('drawingCanvas');
    context = myCanvas.getContext('2d');

    layer1 = document.getElementById('layer1');
    context1 = layer1.getContext('2d');document.addEventListener("touchmove", preventBehavior, false);

    // set canvas width to 60% of the window note: canvas 
    // id in css must be set to left: 20%; to accomadate
    var canvasWidthToWindow = .6;

    // set canvas heigth to 90% of the window note: canvas 
    // id in css must be set to top: 5%; to accomadate
    var canvasHeightToWindow = .9;

    // gets the browser window dimensions
    var viewportWidth = window.innerWidth;
    var viewportHeight = window.innerHeight;

    // get our canvas dimensions 
    var canvasWidth = viewportWidth * canvasWidthToWindow;
    var canvasHeight = viewportHeight * canvasHeightToWindow;

    // set the the canvas dimensions
    myCanvas.setAttribute('width', canvasWidth);
    myCanvas.setAttribute('height', canvasHeight);
    layer1.setAttribute('width', canvasWidth);
    layer1.setAttribute('height', canvasHeight);

    // set canvas background color white its magic
    context.fillStyle = '#ffffff';
    //context1.fillStyle = '#ffffff';
    // fill the canvas with background color
    context.fillRect(0, 0, canvasWidth, canvasHeight);
    //myCanvas.style.backgroundImage = defaultBackground;
    outlineImage.src = currentPage;


    // this makes sure the image is loaded before we move on
    // else the image will not be displayed

    outlineImage.onload = function() {
        context1.drawImage(outlineImage, 0, 0, canvasWidth, canvasHeight);
    };
    
    //***************** Drawing Canvas Events ******************//

    painting = false;
    
    

    $('#drawingCanvas').on('vmousedown', function(e) { // mouse move handler
        
        var canvasOffset = $(myCanvas).offset();
        var canvasX = Math.floor(e.pageX - canvasOffset.left);
        var canvasY = Math.floor(e.pageY - canvasOffset.top);
        if (state === fillBucket) {
            floodFillScanLine(canvasX, canvasY, currentColor, context, context1);
        } else {
            context.beginPath();
            context.moveTo(canvasX - 1, canvasY);
            context.lineTo(canvasX, canvasY);
            
            if(state === eraser){
               context.strokeStyle = "white";
            }else{
               context.strokeStyle = currentColor; 
            }
            context.lineCap = "round";//Draw a line with rounded end caps
            context.lineJoin = "round";//Create a rounded corner when the two lines meet
            context.lineWidth = currentSize;
            context.stroke();
            painting = true;
        }
        if (sizePanelOpen) {
            $('.sizeselect').fadeToggle("fast", "linear");
            sizePanelOpen = false;
            $("#sizepreview").toggleClass("down");
            buttonSize = false;
        }
        if (colorPanelOpen) {
            $('.colorselect').fadeToggle("fast", "linear");
            colorPanelOpen = false;
            $("#preview").toggleClass("down");
            buttonColor = false;
        }
    });


    $("#drawingCanvas").on('vmousemove', function(e) {
        var canvasOffset = $(myCanvas).offset();
        var canvasX = Math.floor(e.pageX - canvasOffset.left);
        var canvasY = Math.floor(e.pageY - canvasOffset.top);
        if (state === fillBucket) {
            // do nothing
        } else {
            if (painting) {
                context.lineTo(canvasX, canvasY);
                context.stroke();
            }
        }
    });

    $('#drawingCanvas').on('vmouseup', function(e) { // mouse move handler

        if (state === fillBucket) {
        } else {
            if (painting) {
                painting = false;
            }
        }
    });

    $('#drawingCanvas').on('vmouseout', function(e) {
        if (state === fillBucket) {
        } else {
            if (painting) {
                painting = false;
            }
        }
    });
    
    //***************** Drawing Canvas Events ******************//


    //***************** Left Side Buttons ******************//

    var buttonColor = false;
    var buttonSize = false;
    var buttonBrush = true;
    var buttonBucket = false;
    var buttonEraser = false;

    $(document).ready(function() {
        
        //***************** Color and Size ******************//

        $('#preview').click(function() {
            $(this).toggleClass("down");
            buttonColor = !buttonColor;
            $('#preview').css('backgroundColor', currentColor);
            if (buttonSize) {
                $("#sizepreview").toggleClass("down");
                $('#sizepreview').css('backgroundColor', currentColor);
                buttonSize = false;
                if (sizePanelOpen) {
                    $('.sizeselect').fadeToggle("fast", "linear");
                    sizePanelOpen = false;
                }
            }
        });

        $('#sizepreview').click(function() {
            $(this).toggleClass("down");
            buttonSize = !buttonSize;
            $('#sizepreview').css('backgroundColor', currentColor);
            if (buttonColor) {
                $("#preview").toggleClass("down");
                $('#preview').css('backgroundColor', currentColor);
                buttonColor = false;
                if (colorPanelOpen) {
                    $('.colorselect').fadeToggle("fast", "linear");
                    colorPanelOpen = false;
                }
            }
        });
        
        //***************** Color and Size End ******************//
        
        //***************** Tools ******************//

        $('#brushtool').click(function() {
            if (!buttonBrush) {
                $(this).toggleClass("down");
                buttonBrush = true;


                $('#brushtool').css('backgroundColor', currentColor);
                if (buttonColor) {
                    $("#preview").toggleClass("down");
                    $('#preview').css('backgroundColor', currentColor);
                    buttonColor = false;
                    if (colorPanelOpen) {
                        $('.colorselect').fadeToggle("fast", "linear");
                        colorPanelOpen = false;
                    }
                }
                if (buttonSize) {
                    $("#sizepreview").toggleClass("down");
                    $('#sizepreview').css('backgroundColor', currentColor);
                    buttonSize = false;
                    if (sizePanelOpen) {
                        $('.sizeselect').fadeToggle("fast", "linear");
                        sizePanelOpen = false;
                    }
                }
                
                if (buttonBucket) {
                    $("#buckettool").toggleClass("down");
                    $('#buckettool').css('backgroundColor', currentColor);
                    buttonBucket = false;
                }
                
                if (buttonEraser) {
                    $("#erasertool").toggleClass("down");
                    $('#erasertool').css('backgroundColor', currentColor);
                    buttonEraser = false;
                }
            }
        });

        $('#buckettool').click(function() {
            if (!buttonBucket) {
                $(this).toggleClass("down");
                buttonBucket = true;
                //$(this).css({ boxShadow: '10px 10px 10px ' + currentColor });
                
                $('#buckettool').css('backgroundColor', currentColor);
                if (buttonColor) {
                    $("#preview").toggleClass("down");
                    $('#preview').css('backgroundColor', currentColor);
                    buttonColor = false;
                    if (colorPanelOpen) {
                        $('.colorselect').fadeToggle("fast", "linear");
                        colorPanelOpen = false;
                    }
                }
                if (buttonSize) {
                    $("#sizepreview").toggleClass("down");
                    $('#sizepreview').css('backgroundColor', currentColor);
                    buttonSize = false;
                    if (sizePanelOpen) {
                        $('.sizeselect').fadeToggle("fast", "linear");
                        sizePanelOpen = false;
                    }
                }
                if (buttonBrush) {
                    $("#brushtool").toggleClass("down");
                    $('#brushtool').css('backgroundColor', currentColor);
                    buttonBrush = false;
                }
                
                if (buttonEraser) {
                    $("#erasertool").toggleClass("down");
                    $('#erasertool').css('backgroundColor', currentColor);
                    buttonEraser = false;
                }
            }
        });
        $('#erasertool').click(function() {
            if (!buttonEraser) {
                $(this).toggleClass("down");
                buttonEraser = true;
                //$(this).css({ boxShadow: '10px 10px 10px ' + currentColor });
                $('#buckettool').css('backgroundColor', currentColor);
                
                if (buttonColor) {
                    $("#preview").toggleClass("down");
                    $('#preview').css('backgroundColor', currentColor);
                    buttonColor = false;
                    if (colorPanelOpen) {
                        $('.colorselect').fadeToggle("fast", "linear");
                        colorPanelOpen = false;
                    }
                } 
                
                if (buttonSize) {
                    $("#sizepreview").toggleClass("down");
                    $('#sizepreview').css('backgroundColor', currentColor);
                    buttonSize = false;
                    if (sizePanelOpen) {
                        $('.sizeselect').fadeToggle("fast", "linear");
                        sizePanelOpen = false;
                    }
                }
                
                if (buttonBrush) {
                    $("#brushtool").toggleClass("down");
                    $('#brushtool').css('backgroundColor', currentColor);
                    buttonBrush = false;
                }
                
                if (buttonBucket) {
                    $("#buckettool").toggleClass("down");
                    $('#buckettool').css('backgroundColor', currentColor);
                    buttonBucket = false;
                }
            }
        });
        
        //***************** Tools End ******************//
        
    });
    
/*
    $(document).ready(function() {
        var speed = 600;
        $('#scrollButtonUp').hover(function() {
            $('#carousel ul').animate({marginTop: "-300px"}, "fast");
        });
        $('#scrollButtonDown').hover(function() {
            $('#carousel ul').animate({marginTop: "1px"}, "fast");
        });
        
    });
*/
   /* $(document).ready(function() {
    
    if ($('#carousel ul').height() > $('#scrollContainer').height()) {
        $("#scrollButtonDown").hover(function () {
            animateContent("down");
        }, function() { $('#carousel ul').stop(); });
    
        $("#scrollButtonUp").hover(function () {
            animateContent("up");
        }, function() { $('#carousel ul').stop(); });
    }
}); 

function animateContent(direction) {  
    var animationOffset = $('#scrollContainer').height() - $('#carousel ul').height();
    if (direction == 'up') {
        animationOffset = 0;
    }
    var speed = 1200;
    $('#carousel ul').animate({ "marginTop": animationOffset + "px" }, speed);
}*/
    
    //***************** Scroll Button Shading ******************//

$(function() {
    $('#scrollButtonDown').css('opacity', 0);
    
    $('#scrollContainer').scroll(function() {
        var total = $(this)[0].scrollHeight - $(this).height();
        var opacity = $(this).scrollTop() / total;
        $('#scrollButtonDown').css('opacity', opacity);
        $('#scrollButtonUp').css('opacity', (1 - opacity));
    });

    $('#scrollButtonDown').click(function() {
        $('#carousel ul').animate({
            scrollTop: 0
        }, 100);
    });
});

function drawSoftLine(x1, y1, x2, y2, lineWidth, r, g, b, a) {
   ctx.save();
   var widths = [1   , 0.8 , 0.6 , 0.4 , 0.2  ];
   var alphas = [0.2 , 0.4 , 0.6 , 0.8 , 1    ];
   var previousAlpha = 0;
   for (var pass = 0; pass < widths.length; pass++) {
      ctx.beginPath();
      ctx.lineWidth = lineWidth * widths[pass];
      var alpha = a * alphas[pass];
      // Formula: (1 - alpha) = (1 - deltaAlpha) * (1 - previousAlpha)
      var deltaAlpha = 1 - (1 - alpha) / (1 - previousAlpha)
      ctx.strokeStyle = "rgba(" + r + "," + g + "," + b + "," + deltaAlpha + ")";
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      previousAlpha = alpha; }
   ctx.restore(); }

    //***************** Color Select Canvas Events ******************//

    $(function() {
        // drawing active image
        var image = new Image();
        image.onload = function() {
            // draws the image on the canvas note: dimensions must match canvas dimensions
            ctx1.drawImage(image, 0, 0, 428, 339);
        };
        // select desired colorwheel/chart
        var imageSrc = 'assets/colorWheel.png';

        image.src = imageSrc;

        $('#layer2').on('vmousedown', function(e) { // mouse move handler
            // get coordinates of current position
            var canvasOffset = $(canvas1).offset();
            var canvasX = Math.floor(e.pageX - canvasOffset.left);
            var canvasY = Math.floor(e.pageY - canvasOffset.top);

            // get current pixel
            var imageData = ctx1.getImageData(canvasX, canvasY, 1, 1);

            // gets the color data for the pixel
            var pixel = imageData.data;

            // stores rgb color value in pixelColor
            var pixelColor = "rgb(" + pixel[0] + ", " + pixel[1] + ", " + pixel[2] + ")";

            // set the background color of preview
            $('#preview').css('backgroundColor', pixelColor);

            // sets the paint color to the current color and rgb values
            currentColorR = pixel[0];
            currentColorG = pixel[1];
            currentColorB = pixel[2];
            currentColor = pixelColor;
        });
        $('#layer2').on('vmouseup', function(e) { // mouse move handler
            colorPanelOpen = false;
            // closes the color palette window
            $('.colorselect').fadeToggle("fast", "linear");
        });

        // this is the clicking of the colorchart event listener
        $('#preview').click(function(e) { // preview click
            if (sizePanelOpen) {
                $('.sizeselect').fadeToggle("fast", "linear");
                sizePanelOpen = false;
            }
            // closes the color palette window
            colorPanelOpen = !colorPanelOpen;
            $('.colorselect').fadeToggle("fast", "linear");
        });

        $('#layer2').on('vmousemove', function(e) {
            // get coordinates of current position
            var canvasOffset = $(canvas1).offset();
            var canvasX = Math.floor(e.pageX - canvasOffset.left);
            var canvasY = Math.floor(e.pageY - canvasOffset.top);

            var imageData = ctx1.getImageData(canvasX, canvasY, 1, 1);
            var pixel = imageData.data;
            var pixelColor = "rgb(" + pixel[0] + ", " + pixel[1] + ", " + pixel[2] + ")";

            // set the background color of preview
            $('#preview').css('backgroundColor', pixelColor);
            // set the background color of preview
            $('#sizepreview').css('backgroundColor', pixelColor);
            // set the background color of preview
            $('#erasertool').css('backgroundColor', pixelColor);
            // set the background color of preview
            $('#brushtool').css('backgroundColor', pixelColor);
            $('#buckettool').css('backgroundColor', pixelColor);
        });
    });
    
    //***************** Color Select Canvas Events End ******************//
    
    //***************** Size Select Canvas Events ******************//

    $(function() {

        // drawing active image
        var image1 = new Image();
        image1.onload = function() {
            ctx.drawImage(image1, 0, 4, 400, 125);
        };

        // size selector image
        var imageSrc1 = 'assets/sizeSelection.png';

        image1.src = imageSrc1;

        // drawing active image
        var image2 = new Image();
        image2.onload = function() {
            ctx.drawImage(image2, 0, 4, 400, 125);
        };
        // size background image
        var imageSrc2 = 'assets/sizeSelectionMedium.png';

        image2.src = imageSrc2;
        ctx.drawImage(image2, 0, 4, 400, 125);
        $('#layer3').on('vmousedown', function(e) { // mouse move handler
            var canvasOffset = $(canvas).offset();
            var canvasX = Math.floor(e.pageX - canvasOffset.left);

            if (canvasX <= 56) {
                currentSize = sizeExtraSmall;
                //ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
                var imageSrc2 = 'assets/sizeSelectionExtraSmall.png';
                image2.src = imageSrc2;
                ctx.drawImage(image2, 0, 4, 400, 125);
            }
            if (canvasX <= 111 && canvasX > 56) {
                currentSize = sizeSmall;
                //ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
                var imageSrc2 = 'assets/sizeSelectionSmall.png';
                image2.src = imageSrc2;
                ctx.drawImage(image2, 0, 4, 400, 125);
            }
            if (canvasX <= 178 && canvasX > 111) {
                currentSize = sizeMedium;
                //ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
                var imageSrc2 = 'assets/sizeSelectionMedium.png';
                image2.src = imageSrc2;
                ctx.drawImage(image2, 0, 4, 400, 125);
            }
            if (canvasX <= 268 && canvasX > 178) {
                currentSize = sizeLarge;
                //ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
                var imageSrc2 = 'assets/sizeSelectionLarge.png';
                image2.src = imageSrc2;
                ctx.drawImage(image2, 0, 4, 400, 125);
            }
            if (canvasX <= 400 && canvasX > 268) {
                currentSize = sizeExtraLarge;
                //ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
                var imageSrc2 = 'assets/sizeSelectionExtraLarge.png';
                image2.src = imageSrc2;
                ctx.drawImage(image2, 0, 4, 400, 125);
            }


            // closes the color palette window
            $('.sizeselect').fadeToggle("fast", "linear");
            sizePanelOpen = false;
        });

        // this is the actual clicking of the colorchart event listener
        $('#sizepreview').click(function(e) { // preview click
            if (colorPanelOpen) {
                $('.colorselect').fadeToggle("fast", "linear");
                colorPanelOpen = false;
            }
            // closes the color palette window
            sizePanelOpen = !sizePanelOpen;
            $('.sizeselect').fadeToggle("fast", "linear");
        });
    });
};

//***************** Size Select Canvas Events End ******************//

// function for setting a new color
var setColor = function(color) {
    currentColor = color;
};

// function for setting a new color
var setSize = function(size) {
    currentSize = size;
};

// this function sets the coloring page its called from the coresponding html button 
var setColoringPage = function(imagePath) {
    context1.save;
    context1.setTransform(1,0,0,1,0,0);
    context1.clearRect(0, 0, layer1.width, layer1.height);
    context1.restore();
    context.clearRect(0, 0, myCanvas.width, myCanvas.height);
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, myCanvas.width, myCanvas.height);
    outlineImage.src = imagePath;
    currentPage = imagePath;
    context1.drawImage(outlineImage, 0, 0, layer1.width, layer1.height);
};
// function for setting a new tool state
var setTool = function(newTool) {
    state = newTool;
};

/************** Multi Layer Flood Fill Scan Line Stack Algoritham  *******************/

/* this allows us to avoid redrawing and still use another layer for our canvas
 * notice it takes two ctx arguments one for the drawing canvas and the second for the 
 * outline canvas.  The drawing canvas checks RGB values but the outline canvas just 
 * checks the alpha(transparency).
 */

var stack = [];


function floodFillScanLine(x, y, curColor, ctx, outlineCtx) {



    if (!stack.push(x, y)) {
        return;
    }
    var width = ctx.canvas.width;
    var height = ctx.canvas.height;

    colorData = ctx.getImageData(0, 0, width, height);
    pixelAddress = (y * width + x) * 4;
    var color = ctx.getImageData(x, y, width, height);
    var pixel = color.data;
    var pixelColor = "rgb(" + pixel[0] + ", " + pixel[1] + ", " + pixel[2] + ")";
    oColorData = outlineCtx.getImageData(0, 0, width, height);

    var startColorR = colorData.data[pixelAddress];
    var startColorG = colorData.data[pixelAddress + 1];
    var startColorB = colorData.data[pixelAddress + 2];

    var oStartColorA = oColorData.data[pixelAddress + 3];

    var rgb = curColor.match(/\d+/g);
    var curColorR = rgb[0];
    var curColorG = rgb[1];
    var curColorB = rgb[2];

    if (curColor === pixelColor) {
        return;
    }
    if (oStartColorA > 5) {
        return;
    }


    var y1;
    var Left;
    var Right;

    while (stack.length > 0) {
        y = stack.pop();
        x = stack.pop();
        pixelAddress = (y * width + x) * 4;
        y1 = y;

        while (y1 >= 0 && compareColor(pixelAddress, startColorR, startColorG, startColorB)
                && checkPixelA(pixelAddress)) {
            y1--;
            pixelAddress -= width * 4;
        }
        pixelAddress += width * 4;
        y1++;
        Left = Right = false;

        while (y1 < height && compareColor(pixelAddress, startColorR, startColorG, startColorB)
                && checkPixelA(pixelAddress)) {
            y1++;

            colorData.data[pixelAddress] = curColorR;
            colorData.data[pixelAddress + 1] = curColorG;
            colorData.data[pixelAddress + 2] = curColorB;
            colorData.data[pixelAddress + 3] = 255;
            //context.putImageData(colorData, 0, 0);


            if (!Left && x > 0 && compareColor(pixelAddress - 4, startColorR, startColorG, startColorB, colorData)
                    && checkPixelA(pixelAddress)) {
                if (!stack.push(x - 1, y1))
                    return;
                Left = true;
            } else if (Left && x > 0 && compareColor(pixelAddress - 4, startColorR, startColorG, startColorB, colorData)
                    && checkPixelA(pixelAddress)) {
                Left = false;
            }
            if (!Right && x < (width - 1) && compareColor(pixelAddress + 4, startColorR, startColorG, startColorB, colorData)
                    && checkPixelA(pixelAddress)) {
                if (!stack.push(x + 1, y1))
                    return;
                Right = true;
            } else if (Right && x < (width - 1) && compareColor(pixelAddress + 4, startColorR, startColorG, startColorB, colorData)
                    && checkPixelA(pixelAddress)) {
                Right = false;
            }
            pixelAddress += width * 4;
        }

    }
    ctx.putImageData(colorData, 0, 0);
}

// compares RGB values to a pixels RGB valus

// has a hardcoded tolerance of 5
compareColor = function(pixelAddress, startR, startG, startB) {

    var r = colorData.data[pixelAddress];
    var g = colorData.data[pixelAddress + 1];
    var b = colorData.data[pixelAddress + 2];
    var a = colorData.data[pixelAddress + 3];

    // If the current pixel matches the clicked color
    if (r <= startR + 5 && r >= startR - 5 &&
            g <= startG + 5 && g >= startG - 5 &&
            b <= startB + 5 && b >= startB - 5) {
        return true;
    } else {
        return false;
    }
};

// checks the alpha(transparency) variable

checkPixelA = function(pixelAddress) {

    var a = oColorData.data[pixelAddress + 3];

    if (a > 200) {
        return false;
    } else {
        return true;
    }
};
