/*
 * Worcester State University
 * CS_401 Software Developement
 * Coloring Team: Jason Hintlian and Beto Luna
 
Copyright 2013 Jason Hintlian and Beto Luna

This file is part of the Jeppson Idea Lab Orantes App (JILOA).

    JILOA is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    JILOA is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with JILOA.  If not, see <http://www.gnu.org/licenses/>.
*/

//var tool;
var paint = "paint";
var fillBucket = "fillBucket";
var eraser = "eraser";
var spray = "spray";
var state = "paint";

var sizePanelOpen = false;
var colorPanelOpen = false;
var buttonColor = false;

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
var currentPage = "assets/1.png";

// color variables
var colorData;
var outlineColorData;
var currentColor = "rgba(255, 204, 0, 255)";
var currentColorR = 0;
var currentColorG = 0;
var currentColorB = 0;
var currentColorA = 255;

//var currentState = new Red(this);
var myCanvas, layer1, context, context1, canvas, ctx, undoRedoClear, canvasTools, ctxTools;

var image3 = new Image();
var imageSrc3 = 'assets/sizeSelection.png';
image3.src = imageSrc3;

var image4 = new Image();
var imageSrc4 = 'assets/sizeSelectionMedium.png';
image4.src = imageSrc4;

// mobile safari fix for redo and undo
var userAgent = window.navigator.userAgent;

window.onload = window.onresize = function() {

// color menu
    var canvas1 = document.getElementById('layer2');
    var ctx1 = canvas1.getContext('2d');

    // Get the canvas element and its drawing context
    myCanvas = document.getElementById('drawingCanvas');
    context = myCanvas.getContext('2d');

    layer1 = document.getElementById('layer1');
    context1 = layer1.getContext('2d');

    // size menu
    canvas = document.getElementById('layer3');
    ctx = canvas.getContext('2d');

    // tool box menu
    canvasTools = document.getElementById('toolbox');
    ctxTools = canvasTools.getContext('2d');

    var canvasToolsBackground = document.getElementById('toolboxBackground');
    var ctxToolsBackground = canvasToolsBackground.getContext('2d');

    // set canvas width to 60% of the window note: canvas
    // id in css must be set to left: 20%; to accomadate
    var canvasWidthToWindow = .65;

    // set canvas heigth to 90% of the window note: canvas
    // id in css must be set to top: 5%; to accomadate
    var canvasHeightToWindow = .98;

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

    document.ontouchmove = function(event) {
        event.preventDefault();
    };


    // this makes sure the image is loaded before we move on
    // else the image will not be displayed

    outlineImage.onload = function() {
        context1.drawImage(outlineImage, 0, 0, canvasWidth, canvasHeight);
        cPush();
    };

    // sets the border to the 1st color yellow
    $('#color1').css('box-shadow', '0px 0px 2pt 1pt #000000');

    // sets the border to the 1st pic1 
    $('#pic1').css('box-shadow', '0px 0px 2pt 1pt #000000');


    //***************** Drawing Canvas Events ******************//
    painting = false;
    var softWidths = [1, 0.95, 0.9, 0.85, 0.8, 0.75, 0.7, 0.65, 0.6, 0.55, 0.5, 0.45, 0.4, 0.35, 0.3, 0.25, 0.2, 0.15, 0.1, 0.05];

    $('#drawingCanvas').on('vmousedown touchstart', function(e) { // mouse move handler
        e.preventDefault();
        $('#preview').css('backgroundColor', currentColor);
        $('#brushtool').css('backgroundColor', currentColor);
        $('#buckettool').css('backgroundColor', currentColor);




        var canvasOffset = $(myCanvas).offset();
        var canvasX = Math.floor(e.pageX - canvasOffset.left);
        var canvasY = Math.floor(e.pageY - canvasOffset.top);

        if (state === fillBucket) {
            floodFillScanLine(canvasX, canvasY, currentColor, context, context1);
        } else {
            context.beginPath();
            context.lineCap = "round";//Draw a line with rounded end caps
            context.lineJoin = "round";//Create a rounded corner when the two lines meet

            if (state === spray) {
                for (var pass = 0; pass < softWidths.length; pass++) {
                    context.lineWidth = (currentSize * 1.5) * softWidths[pass];
                    context.strokeStyle = "rgba(" + currentColorR + "," + currentColorG + "," + currentColorB + "," + .01 * pass / 2 + ")";
                    context.moveTo(canvasX - 1, canvasY);
                    context.lineTo(canvasX, canvasY);
                    context.stroke();
                }
            } else {
                if (state === eraser) {
                    context.strokeStyle = "white";
                } else {
                    context.strokeStyle = currentColor;
                }
                context.lineWidth = currentSize;
                context.moveTo(canvasX - 1, canvasY);
                context.lineTo(canvasX, canvasY);
                context.stroke();
            }
        }
        painting = true;
    });


    $("#drawingCanvas").on('vmousemove touchmove', function(e) {
        e.preventDefault();

        if (state === fillBucket) {
            // do nothing
        } else {
            if (painting) {
                var canvasOffset = $(myCanvas).offset();
                var canvasX = Math.floor(e.pageX - canvasOffset.left);
                var canvasY = Math.floor(e.pageY - canvasOffset.top);
                context.lineTo(canvasX, canvasY);
                if (state === spray) {
                    context.beginPath();
                    for (var pass = 0; pass < softWidths.length; pass++) {
                        context.lineWidth = (currentSize * 1.5) * softWidths[pass];
                        context.strokeStyle = "rgba(" + currentColorR + "," + currentColorG + "," + currentColorB + "," + .01 * pass / 2 + ")";
                        context.moveTo(canvasX - 1, canvasY);
                        context.lineTo(canvasX, canvasY);
                        context.stroke();
                    }
                } else {
                    if (state === eraser) {
                        context.strokeStyle = "#ffffff";
                    }
                    else {
                        context.strokeStyle = currentColor;
                    }
                    context.lineWidth = currentSize;
                    context.lineTo(canvasX, canvasY);
                    context.stroke();
                    //context.closePath();
                }
            }
        }

    });

    $('#drawingCanvas').on('vmouseup touchend', function(e) { // mouse move handler
        e.preventDefault();
        if (state === fillBucket) {
        } else {
            if (painting) {
                context.closePath();
                painting = false;
            }
        }
        cPush();
    });

    $('#drawingCanvas').on('vmouseout', function(e) {
        if (state === fillBucket) {
        } else {
            if (painting) {
                context.closePath();
                painting = false;
            }
        }
    });



    //***************** Drawing Canvas Events ******************//

    //****************** Paint Buttons *******************//

    $('#color1').on('vmousedown', function() {
        setPaint('#ffcc00');
        $('.paintbutton').css('box-shadow', '0px 0px 0pt 0pt #000000');
        $('#color1').css('box-shadow', '0px 0px 2pt 1pt #000000');
    });
    $('#color2').on('vmousedown', function() {
        setPaint('#ffa347');
        $('.paintbutton').css('box-shadow', '0px 0px 0pt 0pt #000000');
        $('#color2').css('box-shadow', '0px 0px 2pt 1pt #000000');
    });
    $('#color3').on('vmousedown', function() {
        setPaint('#e65c00');
        $('.paintbutton').css('box-shadow', '0px 0px 0pt 0pt #000000');
        $('#color3').css('box-shadow', '0px 0px 2pt 1pt #000000');
    });
    $('#color4').on('vmousedown', function() {
        setPaint('#52cccc');
        $('.paintbutton').css('box-shadow', '0px 0px 0pt 0pt #000000');
        $('#color4').css('box-shadow', '0px 0px 2pt 1pt #000000');
    });
    $('#color5').on('vmousedown', function() {
        setPaint('#29a6cf');
        $('.paintbutton').css('box-shadow', '0px 0px 0pt 0pt #000000');
        $('#color5').css('box-shadow', '0px 0px 2pt 1pt #000000');
    });
    $('#color6').on('vmousedown', function() {
        setPaint('#3083d6');
        $('.paintbutton').css('box-shadow', '0px 0px 0pt 0pt #000000');
        $('#color6').css('box-shadow', '0px 0px 2pt 1pt #000000');
    });
    $('#color7').on('vmousedown', function() {
        setPaint('#f8ddd4');
        $('.paintbutton').css('box-shadow', '0px 0px 0pt 0pt #000000');
        $('#color7').css('box-shadow', '0px 0px 2pt 1pt #000000');
    });
    $('#color8').on('vmousedown', function() {
        setPaint('#efb29e');
        $('.paintbutton').css('box-shadow', '0px 0px 0pt 0pt #000000');
        $('#color8').css('box-shadow', '0px 0px 2pt 1pt #000000');
    });
    $('#color9').on('vmousedown', function() {
        setPaint('#bc8f8f');
        $('.paintbutton').css('box-shadow', '0px 0px 0pt 0pt #000000');
        $('#color9').css('box-shadow', '0px 0px 2pt 1pt #000000');
    });
    $('#color10').on('vmousedown', function() {
        setPaint('#deb887');
        $('.paintbutton').css('box-shadow', '0px 0px 0pt 0pt #000000');
        $('#color10').css('box-shadow', '0px 0px 2pt 1pt #000000');
    });
    $('#color11').on('vmousedown', function() {
        setPaint('#b85c00');
        $('.paintbutton').css('box-shadow', '0px 0px 0pt 0pt #000000');
        $('#color11').css('box-shadow', '0px 0px 2pt 1pt #000000');
    });
    $('#color12').on('vmousedown', function() {
        setPaint('#993300');
        $('.paintbutton').css('box-shadow', '0px 0px 0pt 0pt #000000');
        $('#color12').css('box-shadow', '0px 0px 2pt 1pt #000000');
    });

    //****************** Paint Buttons End*******************//

    //****************** Statue Buttons *******************//

    $('#pic1').on('vmousedown', function() {
        setColoringPage("assets/1.png");
        $('.coloringPage').css('box-shadow', '0px 0px 0pt 0pt #000000');
        $('#pic1').css('box-shadow', '0px 0px 2pt 1pt #000000');
    });
    $('#pic2').on('vmousedown', function() {
        setColoringPage("assets/2.png");
        $('.coloringPage').css('box-shadow', '0px 0px 0pt 0pt #000000');
        $('#pic2').css('box-shadow', '0px 0px 2pt 1pt #000000');
    });
    $('#pic3').on('vmousedown', function() {
        setColoringPage("assets/3.png");
        $('.coloringPage').css('box-shadow', '0px 0px 0pt 0pt #000000');
        $('#pic3').css('box-shadow', '0px 0px 2pt 1pt #000000');
    });
    $('#pic4').on('vmousedown', function() {
        setColoringPage("assets/4.png");
        $('.coloringPage').css('box-shadow', '0px 0px 0pt 0pt #000000');
        $('#pic4').css('box-shadow', '0px 0px 2pt 1pt #000000');
    });
    $('#pic5').on('vmousedown', function() {
        setColoringPage("assets/5.png");
        $('.coloringPage').css('box-shadow', '0px 0px 0pt 0pt #000000');
        $('#pic5').css('box-shadow', '0px 0px 2pt 1pt #000000');
    });
    $('#pic6').on('vmousedown', function() {
        setColoringPage("assets/6.png");
        $('.coloringPage').css('box-shadow', '0px 0px 0pt 0pt #000000');
        $('#pic6').css('box-shadow', '0px 0px 2pt 1pt #000000');
    });
    $('#pic7').on('vmousedown', function() {
        setColoringPage("assets/7.png");
        $('.coloringPage').css('box-shadow', '0px 0px 0pt 0pt #000000');
        $('#pic7').css('box-shadow', '0px 0px 2pt 1pt #000000');
    });








    //***************** Color Button ******************//

    $('#preview').on('vmousedown', function() {

        $('#preview').css('backgroundColor', currentColor);
        $('#brushtool').css('backgroundColor', currentColor);
        $('#buckettool').css('backgroundColor', currentColor);
        $('#spraytool').css('backgroundColor', currentColor);
        if (!buttonColor) {
            $('#preview').css("border", "0px solid #000000");
            $('#preview').css("background", "url(assets/paintPalette2.png)");
            buttonColor = true;
        } else {
            $('#preview').css("border", "1px solid #000000");
            $('#preview').css("background", "url(assets/Buttons/spectrum-01.png)");
            buttonColor = false;

        }

        $('#preview').css('backgroundColor', currentColor);

        if (colorPanelOpen) {
            colorPanelOpen = false;
            $('.colorselect').fadeToggle("fast", "linear");
        } else {
            colorPanelOpen = true;
            $('.colorselect').fadeToggle("fast", "linear");
        }
    });
    //***************** Color Button End ******************//


    //***************** Color Select Canvas Events ******************//

    // color menu
    var canvas1 = document.getElementById('layer2');
    var ctx1 = canvas1.getContext('2d');
    colorSelectDown = false;

    $(function() {
        // drawing active image
        var image = new Image();
        var imageSrc = 'assets/colorWheel.png';
        image.src = imageSrc;

        /* var image2 = new Image();
         var imageSrc2 = 'assets/whiteBlackSelectArrow.png';
         image2.src = imageSrc2;*/

        image.onload = function() {
            ctx1.drawImage(image, 0, 0, 200, 260);
            // ctx1.drawImage(image2, 210, 168, 40, 20);
        };

        $('#layer2').on('vmousedown', function(e) {
            var canvasOffset = $(canvas1).offset();
            var canvasX = Math.floor(e.pageX - canvasOffset.left);
            var canvasY = Math.floor(e.pageY - canvasOffset.top);
            colorSelectDown = true;
        });

        $('#layer2').on('vmouseup', function(e) { // mouse move handler

            colorSelectDown = false;

            var canvasOffset = $(canvas1).offset();
            var canvasX = Math.floor(e.pageX - canvasOffset.left);
            var canvasY = Math.floor(e.pageY - canvasOffset.top);
            //$('.paintbutton').css('outline', '0px solid #000000'); 

            // get current pixel
            var imageData = ctx1.getImageData(canvasX, canvasY, 1, 1);

            // gets the color data for the pixel
            var pixel = imageData.data;

            // stores rgb color value in pixelColor
            var pixelColor = "rgba(" + pixel[0] + ", " + pixel[1] + ", " + pixel[2] + ", " + pixel[3] + ")";

            // set the background color of preview
            $('#preview').css('backgroundColor', pixelColor);

            // sets the paint color to the current color and rgb values
            currentColorR = pixel[0];
            currentColorG = pixel[1];
            currentColorB = pixel[2];
            currentColorA = pixel[3];
            currentColor = pixelColor;
            $('#preview').css('backgroundColor', pixelColor);
            $('#brushtool').css('backgroundColor', pixelColor);
            $('#buckettool').css('backgroundColor', pixelColor);
            $('#spraytool').css('backgroundColor', pixelColor);
            $('#toolboxBackground').css('backgroundColor', currentColor);

            ctx.fillStyle = currentColor;
            ctx.fillRect(10, 4, 210, 60);
            ctx.drawImage(image3, 0, 0, 200, 60);
            ctx.drawImage(image4, 0, 0, 200, 60);

        });


        $('#layer2').on('vmouseout', function(e) {
            //colorSelectDown = false;
        });

        $('#layer2').on('vmousemove', function(e) {
            e.preventDefault();
            // get coordinates of current position
            var canvasOffset = $(canvas1).offset();
            var canvasX = Math.floor(e.pageX - canvasOffset.left);
            var canvasY = Math.floor(e.pageY - canvasOffset.top);

            if (colorSelectDown === true) {
                // get current pixel
                var imageData = ctx1.getImageData(canvasX, canvasY, 1, 1);

                // gets the color data for the pixel
                var pixel = imageData.data;

                // stores rgb color value in pixelColor
                var pixelColor = "rgba(" + pixel[0] + ", " + pixel[1] + ", " + pixel[2] + ", " + pixel[3] + ")";

                // set the background color of preview
                $('#preview').css('backgroundColor', pixelColor);

                $('#preview').css('backgroundColor', pixelColor);
                $('#brushtool').css('backgroundColor', pixelColor);
                $('#buckettool').css('backgroundColor', pixelColor);
                $('#spraytool').css('backgroundColor', pixelColor);

                ctx.fillStyle = pixelColor;
                ctx.fillRect(10, 4, 210, 60);
                ctx.drawImage(image3, 0, 0, 200, 60);
                ctx.drawImage(image4, 0, 0, 200, 60);
                $('#toolboxBackground').css('backgroundColor', pixelColor);
                ctx.fillStyle = currentColor;
            }
        });
    });

    //***************** Color Select Canvas Events End ******************//

    //***************** Size Select Canvas Events ******************//

    // drawing active images
    ctx.fillStyle = currentColor;
    ctx.fillRect(10, 4, 200, 60);
    ctx.drawImage(image3, 0, 0, 200, 60);
    ctx.drawImage(image4, 0, 0, 200, 60);



    // size background image


    $(function() {


        $('#layer3').on('vmousedown', function(e) { // mouse move handler
            var canvasOffset = $(canvas).offset();
            var canvasX = Math.floor(e.pageX - canvasOffset.left);

            if (canvasX <= 26) {
                currentSize = sizeExtraSmall;
                //ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
                var imageSrc4 = 'assets/sizeSelectionExtraSmall.png';
                image4.src = imageSrc4;
                image4.onload = function() {
                    ctx.drawImage(image4, 0, 0, 200, 60);
                };

            }
            if (canvasX <= 52 && canvasX > 26) {
                currentSize = sizeSmall;
                //ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
                var imageSrc4 = 'assets/sizeSelectionSmall.png';
                image4.src = imageSrc4;
                image4.onload = function() {
                    ctx.drawImage(image4, 0, 0, 200, 60);
                };
            }
            if (canvasX <= 86 && canvasX > 52) {
                currentSize = sizeMedium;
                //ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
                var imageSrc4 = 'assets/sizeSelectionMedium.png';
                image4.src = imageSrc4;
                image4.onload = function() {
                    ctx.drawImage(image4, 0, 0, 200, 60);
                };
            }
            if (canvasX <= 132 && canvasX > 86) {
                currentSize = sizeLarge;
                //ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
                var imageSrc4 = 'assets/sizeSelectionLarge.png';
                image4.src = imageSrc4;
                image4.onload = function() {
                    ctx.drawImage(image4, 0, 0, 200, 60);
                };
            }
            if (canvasX <= 190 && canvasX > 132) {
                currentSize = sizeExtraLarge;
                //ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
                var imageSrc4 = 'assets/sizeSelectionExtraLarge.png';
                image4.src = imageSrc4;
                image4.onload = function() {
                    ctx.drawImage(image4, 0, 0, 200, 60);
                };
            }
        });
    });

    // undoClearRedo menu




    var canvasUCR = document.getElementById('undoClearRedo');
    var ctxUCR = canvasUCR.getContext('2d');

    var imageUndo = new Image();
    var imageSrc = 'assets/Buttons/undo-off-01.png';
    imageUndo.src = imageSrc;
    imageUndo.onload = function() {
        ctxUCR.drawImage(imageUndo, 0, 5, 55, 59);
    };

    var imageClear = new Image();
    var imageSrc = 'assets/Buttons/clear-off-01.png';
    imageClear.src = imageSrc;
    imageClear.onload = function() {
        ctxUCR.drawImage(imageClear, 67, 5, 55, 59);
    };

    var imageRedo = new Image();
    var imageSrc = 'assets/Buttons/redo-off-01.png';
    imageRedo.src = imageSrc;
    imageRedo.onload = function() {
        ctxUCR.drawImage(imageRedo, 133, 5, 55, 59);
    };

    var imageUndoDown = new Image();
    var imageSrc = 'assets/Buttons/undo-on-01.png';
    imageUndoDown.src = imageSrc;

    var imageClearDown = new Image();
    var imageSrc = 'assets/Buttons/clear-on-01.png';
    imageClearDown.src = imageSrc;

    var imageRedoDown = new Image();
    var imageSrc = 'assets/Buttons/redo-on-01.png';
    imageRedoDown.src = imageSrc;


    $(function() {


        $('#undoClearRedo').on('vmousedown', function(e) { // mouse move handler
            var canvasOffset = $(canvasUCR).offset();
            var canvasX = Math.floor(e.pageX - canvasOffset.left);

            if (canvasX <= 67) {
                ctxUCR.clearRect(0, 5, 55, 59);
                ctxUCR.drawImage(imageUndoDown, 0, 5, 55, 59);
                cUndo();
                // mobile safari fix for redo and undo
                // iPad or iPhone
                if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i)) {
                    cUndo();
                }
            }
            if (canvasX <= 133 && canvasX > 67) {
                ctxUCR.clearRect(67, 5, 55, 59);
                ctxUCR.drawImage(imageClearDown, 67, 5, 55, 59);
                context.fillRect(0, 0, myCanvas.width, myCanvas.height);
                cPush();
            }
            if (canvasX <= 190 && canvasX > 133) {
                ctxUCR.clearRect(133, 5, 55, 59);
                ctxUCR.drawImage(imageRedoDown, 133, 5, 55, 59);
                cRedo();
                // mobile safari fix for redo and undo
                if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i)) {
                    cRedo();
                }
            }
        });

        $('#undoClearRedo').on('vmouseup', function(e) { // mouse move handler
            var canvasOffset = $(canvas).offset();
            var canvasX = Math.floor(e.pageX - canvasOffset.left);

            if (canvasX <= 67) {
                ctxUCR.clearRect(0, 5, 55, 59);
                ctxUCR.drawImage(imageUndo, 0, 5, 55, 59);
            }
            if (canvasX <= 133 && canvasX > 67) {
                ctxUCR.clearRect(67, 5, 55, 59);
                ctxUCR.drawImage(imageClear, 67, 5, 55, 59);
            }
            if (canvasX <= 190 && canvasX > 133) {
                ctxUCR.clearRect(133, 5, 55, 59);
                ctxUCR.drawImage(imageRedo, 133, 5, 55, 59);
            }
            else {
                ctxUCR.clearRect(0, 0, 55, 190);
                ctxUCR.drawImage(imageUndo, 0, 5, 55, 59);
                ctxUCR.drawImage(imageClear, 67, 5, 55, 59);
                ctxUCR.drawImage(imageRedo, 133, 5, 55, 59);
            }
        });
        $('#undoClearRedo').on('vmouseout', function(e) { // mouse move handler

            ctxUCR.clearRect(0, 0, 55, 190);
            ctxUCR.drawImage(imageUndo, 0, 5, 55, 59);
            ctxUCR.drawImage(imageClear, 67, 5, 55, 59);
            ctxUCR.drawImage(imageRedo, 133, 5, 55, 59);

        });
    });


    var toolBoxBackground = new Image();
    var imageSrc = 'assets/toolBoxBackground.png';
    toolBoxBackground.src = imageSrc;
    toolBoxBackground.onload = function() {
        ctxTools.drawImage(toolBoxBackground, 0, 0, 188, 188);
    };

    var imagePaintDown = new Image();
    var imageSrc = 'assets/Buttons/paint-on-01.png';
    imagePaintDown.src = imageSrc;
    imagePaintDown.onload = function() {
        ctxTools.drawImage(imagePaintDown, -1, 0, 94, 87);
    };
    var imageSprayPaint = new Image();
    var imageSrc = 'assets/Buttons/spraypaint-off-01.png';
    imageSprayPaint.src = imageSrc;
    imageSprayPaint.onload = function() {
        ctxTools.drawImage(imageSprayPaint, 95, 0, 94, 87);
    };
    var imagePour = new Image();
    var imageSrc = 'assets/Buttons/pour-off-01.png';
    imagePour.src = imageSrc;
    imagePour.onload = function() {
        ctxTools.drawImage(imagePour, -1, 90, 94, 87);
    };
    var imageEraser = new Image();
    var imageSrc = 'assets/Buttons/eraser-off-01.png';
    imageEraser.src = imageSrc;
    imageEraser.onload = function() {
        ctxTools.drawImage(toolBoxBackground, 0, 0, 188, 188);
        ctxTools.drawImage(imagePaintDown, -1, 0, 94, 87);
        ctxTools.drawImage(imageSprayPaint, 95, 0, 94, 87);
        ctxTools.drawImage(imagePour, -1, 90, 94, 87);
        ctxTools.drawImage(imageEraser, 95, 90, 94, 87);
    };

    var imagePaint = new Image();
    var imageSrc = 'assets/Buttons/paint-off-01.png';
    imagePaint.src = imageSrc;

    var imageSprayPaintDown = new Image();
    var imageSrc = 'assets/Buttons/spraypaint-on-01.png';
    imageSprayPaintDown.src = imageSrc;

    var imagePourDown = new Image();
    var imageSrc = 'assets/Buttons/pour-on-01.png';
    imagePourDown.src = imageSrc;

    var imageEraserDown = new Image();
    var imageSrc = 'assets/Buttons/eraser-on-01.png';
    imageEraserDown.src = imageSrc;


    $(function() {

        $('#toolbox').on('vmousedown', function(e) { // mouse move handler
            var canvasOffset = $(canvasTools).offset();
            var canvasX = Math.floor(e.pageX - canvasOffset.left);
            var canvasY = Math.floor(e.pageY - canvasOffset.top);

            if (canvasX <= 94 && canvasY <= 87) {
                state = paint;
                toggleTools();
                ctxTools.clearRect(-1, 0, 94, 87);
                ctxToolsBackground.drawImage(toolBoxBackground, 0, 0, 188, 188);
                ctxTools.drawImage(imagePaintDown, -1, 0, 94, 87);
            }
            if (canvasX <= 94 && canvasY > 94 && canvasY < 182) {
                state = fillBucket;
                toggleTools();
                ctxTools.clearRect(-1, 90, 94, 87);
                ctxToolsBackground.drawImage(toolBoxBackground, 0, 0, 188, 188);
                ctxTools.drawImage(imagePourDown, -1, 90, 94, 87);
            }
            if (canvasX > 94 && canvasY <= 87) {
                state = spray;
                toggleTools();
                ctxTools.clearRect(95, 0, 94, 87);
                ctxToolsBackground.drawImage(toolBoxBackground, 0, 0, 188, 188);
                ctxTools.drawImage(imageSprayPaintDown, 95, 0, 94, 87);
            }
            if (canvasX > 94 && canvasY > 94 && canvasY < 182) {
                state = eraser;
                toggleTools();
                ctxTools.clearRect(95, 90, 94, 87);
                ctxToolsBackground.drawImage(toolBoxBackground, 0, 0, 188, 188);
                ctxTools.drawImage(imageEraserDown, 95, 90, 94, 87);
            }
        });

        var toggleTools = function() {
            ctxTools.clearRect(-1, 0, 189, 188);
            ctxTools.drawImage(toolBoxBackground, 0, 0, 188, 188);
            ctxTools.drawImage(imagePaint, -1, 0, 94, 87);
            ctxTools.drawImage(imagePour, -1, 90, 94, 87);
            ctxTools.drawImage(imageSprayPaint, 95, 0, 94, 87);
            ctxTools.drawImage(imageEraser, 95, 90, 94, 87);
        };
    });
};

//***************** Size Select Canvas Events End ******************//

// function for setting a new color
var setPaint = function(hex) {

    currentColorR = parseInt((cutHex(hex)).substring(0, 2), 16);
    currentColorG = parseInt((cutHex(hex)).substring(2, 4), 16);
    currentColorB = parseInt((cutHex(hex)).substring(4, 6), 16);
    currentColorA = 255;
    currentColor = "rgba(" + currentColorR + ", " + currentColorG + ", " + currentColorB + ", 255)";
    ctx.fillStyle = currentColor;
    ctx.fillRect(10, 4, 210, 60);
    ctx.drawImage(image3, 0, 0, 200, 60);
    ctx.drawImage(image4, 0, 0, 200, 60);
    $('#toolboxBackground').css('backgroundColor', currentColor);
    $('#preview').css('backgroundColor', currentColor);
    $('#brushtool').css('backgroundColor', currentColor);
    $('#buckettool').css('backgroundColor', currentColor);
    $('#spraytool').css('backgroundColor', currentColor);
};


function cutHex(h) {
    return (h.charAt(0) === "#") ? h.substring(1, 7) : h;
}
;

// function for setting a new color
var setSize = function(size) {
    currentSize = size;
};

// this function sets the coloring page its called from the coresponding html button
var setColoringPage = function(imagePath) {

    outlineImage.src = imagePath;
    currentPage = imagePath;
    context1.save;
    context1.setTransform(1, 0, 0, 1, 0, 0);
    context1.clearRect(0, 0, layer1.width, layer1.height);
    context1.restore();
    context.clearRect(0, 0, myCanvas.width, myCanvas.height);
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, myCanvas.width, myCanvas.height);
    outlineImage.onload();
    cPush();
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
    var pixelColor = "rgba(" + pixel[0] + ", " + pixel[1] + ", " + pixel[2] + ", 255)";
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

//***************** Undo Redo Events ******************//

// Here we create an array of snap shots that we can traverse for the purpose of undo and redo
// the final snap shot can also be used for sending via email so users can keep there work

// Concept taken from
// http://www.codicode.com/art/undo_and_redo_to_the_html5_canvas.aspx
// author Chtiwi Malek
// minor modifications made

var cPushArray = new Array();
var cStep = -1;

// ctx = document.getElementById('myCanvas').getContext("2d");

function cPush() {
    cStep++;
    if (cStep < cPushArray.length) {
        cPushArray.length = cStep;
    }
    cPushArray.push(myCanvas.toDataURL());
}
;
function cClear() {
    cPushArray.length = 0;
    cStep = -1;
}
;

function cRedo() {
    if (cStep < cPushArray.length - 1) {
        cStep++;
        var canvasPic = new Image();
        canvasPic.src = cPushArray[cStep];
        canvasPic.onload = function() {
            context.drawImage(canvasPic, 0, 0);
        };
    }
}
;

function cUndo() {
    if (cStep > 0) {
        cStep--;
        var canvasPic = new Image();
        canvasPic.src = cPushArray[cStep];
        canvasPic.onload = function() {
            context.drawImage(canvasPic, 0, 0);
        };
    }
}
;

//***************** END Undo Redo Events ******************//