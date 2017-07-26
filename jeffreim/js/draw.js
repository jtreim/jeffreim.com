function getRandomFloat(min, max){
	return Math.random() * (max-min) + min;
}
function getRandomInt(min, max){
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max-min+1)) + min;
}

var userPath;
var drawnPaths = [];
var eraserPath;
var curRedraw;
var pathItr = 0;
var segItr = 0;

var color = "#000000";
var cpuColor = "#BB0000";

var xmin;
var xmax;
var ymin;
var ymax;

var stroke = 3;
var cpuStroke = 8;
var drawing = true;

var eraser;
var erasing = false;
var eraserStartLeft = false;

var animate = true;

var redrawnPaths1 = [];
var redrawnPaths2 = [];
var redrawnPaths3 = [];
var eraserPath1;
var eraserPath2;
var eraserPath3;

var clientLayer;
var cpuLayer;

var xRatio = 1;
var yRatio = 1;

var oldWidth;
var oldHeight;

paper.install(window);

window.onload = function(){
	canvas = document.getElementById("gameCanvas");
	canvas.style.backgroundColor = "#FFFFFF";
	canvas.style.width = "100%";
	canvas.style.height = "100%";

	oldWidth = window.innerWidth;
	oldHeight = window.innerHeight;

	paper.setup(canvas);
	
	curRedraw = new paper.Path();
	curRedraw.strokeColor = cpuColor;
	curRedraw.strokeWidth = cpuStroke;

	xmin = canvas.width;
	xmax = 0;
	ymin = canvas.height;
	ymax = 0;

	clientLayer = new paper.Layer();
	cpuLayer = new paper.Layer();
	cpuLayer.blendMode = 'overlay';

	var tool = new Tool();
	tool.onMouseDown = function(event){
		clientLayer.activate();

		var point = event.point;
		point.x = point.x * xRatio;
		point.y = point.y * yRatio;

		userPath = new paper.Path({
			segments: [point],
			strokeColor: color,
			strokeWidth:stroke,
		});
		userPath.strokeColor.alpha = .6;

		if(point.x > xmax){
			xmax = point.x;
		}
		if(point.x < xmin){
			xmin = point.x;
		}
		if(point.y > ymax){
			ymax = point.y;
		}
		if(point.y < ymin){
			ymin = point.y;
		}
		animate = false;
	}
	tool.onMouseDrag = function(event){
		var point = event.point;
		point.x =  point.x * xRatio;
		point.y = point.y * yRatio;

		userPath.add(point);
		if(point.x > xmax){
			xmax = point.x;
		}
		if(point.x < xmin){
			xmin = point.x;
		}
		if(point.y > ymax){
			ymax = point.y;
		}
		if(point.y < ymin){
			ymin = point.y;
		}
	}
	tool.onMouseUp = function(event){
		var point = event.point;
		point.x = point.x * xRatio;
		point.y = point.y * yRatio;

		userPath.add(point);
		if(point.x > xmax){
			xmax = point.x;
		}
		if(point.x < xmin){
			xmin = point.x;
		}
		if(point.y > ymax){
			ymax = point.y;
		}
		if(point.y < ymin){
			ymin = point.y;
		}

		userPath.simplify(2);
		drawnPaths.push(userPath);
		cpuLayer.activate();
		animate = true;
	}

	tool.onMouseLeave = function(event){
		if(!userPath){
			userPath = new Path();
		}
		animate = true;
	}

	view.onFrame = function(event){
		if(animate && drawing && drawnPaths.length > 0){
			redraw();
		}else if(animate && erasing){
			erase();
		}
	}
}

$(document).ready(function(){
	window.addEventListener("resize", function(event){
		xRatio = window.innerWidth/oldWidth;
		yRatio = window.innerHeight/oldHeight;

		oldWidth = window.innerWidth;
		oldHeight = window.innerHeight;
	});
});

function redraw(){
	if(pathItr == drawnPaths.length && drawing){
		eraserStartLeft = !eraserStartLeft;
		drawing = false;
		erasing = true;
		eraser = new Eraser(xmin, xmax, ymin, ymax, eraserStartLeft);
		
		if(eraserPath3){
			eraserPath3.remove();
		}

		if(redrawnPaths3.length > 0){
			for(var i = 0; i < redrawnPaths3.length; i++){
				redrawnPaths3[i].remove();
			}
		}
		redrawnPaths3 = redrawnPaths2;
		redrawnPaths2 = redrawnPaths1;
		redrawnPaths1 = [];

		eraserPath3 = eraserPath2;
		eraserPath2 = eraserPath1;
		eraserPath1 = eraserPath;

		pathItr = 0;
		segItr = 0;
	}else if(pathItr < drawnPaths.length && 
		segItr == drawnPaths[pathItr].segments.length &&
		drawing){
		pathItr++;
		eraserPath = new paper.Path();
		eraserPath.strokeWidth = 60;
		eraserPath.strokeColor = "#FFFFFF";
		eraserPath.strokeColor.alpha = .8;
		redrawnPaths1.push(curRedraw);
		curRedraw = new paper.Path();
		curRedraw.strokeColor = cpuColor;
		curRedraw.strokeWidth = cpuStroke;
		segItr = 0;
	}else if(segItr < drawnPaths[pathItr].segments.length &&
		drawing){
		var path = drawnPaths[pathItr];
		var segment = path.segments[segItr];
		var x = segment.point.x + getRandomInt(-10, 10);
		var y = segment.point.y + getRandomInt(-10, 10);
		var point = new Point(x, y);
		curRedraw.add(point);
		curRedraw.simplify(5);
		segItr++;
	}
}

function erase(){
	if(eraser.eraseAll()){
		erasing = false;
		drawing = true;
	}else{
		var point = new Point(eraser.eraserX, eraser.eraserY);
		eraserPath.add(point);
		eraserPath.smooth({
			type: 'continuous'
		});
	}
}

class Eraser{
	constructor(x_min, x_max, y_min, y_max, startLeft){
		this.strokeWidth = 50;
		this.xmin = x_min - this.strokeWidth/2;
		this.xmax = x_max + this.strokeWidth/2;
		this.ymin = y_min - this.strokeWidth/2;
		this.ymax = y_max + this.strokeWidth/2;
		this.eraserY = this.ymin;
    	this.lineStartY = this.ymin;
		if(startLeft){
    		this.eraserX = this.xmin;
    		this.eraseRight = true;
		}else{
			this.eraserX = this.xmax;
    		this.eraseRight = false;
		}
	}

	eraseAll(){
		if(this.eraserX >= this.xmax && this.eraserY >= this.ymax){
			this.lineStartY = 0;
			return true;
		}else if(this.eraseRight){
			this.eraseLine(this.xmax, this.lineStartY+this.strokeWidth);
		}else{
			this.eraseLine(this.xmin, this.lineStartY+this.strokeWidth);
		}
		if(this.eraserX >= this.xmax || this.eraserX <= this.xmin){
			this.eraseRight = !(this.eraseRight);
			this.lineStartY += this.strokeWidth;
		}
    	return false;
	}

	eraseLine(xEnd, yEnd){
    	var xDist = xEnd - this.eraserX;
    	var yDist = yEnd - this.eraserY;
    	var difference = Math.pow(xDist, 2) + Math.pow(yDist, 2);                             
    	difference = Math.sqrt(difference);

    	
   		var fraction = difference / (this.strokeWidth);
   		this.eraserX += xDist/fraction;
   		this.eraserY += yDist/fraction;
	}
}