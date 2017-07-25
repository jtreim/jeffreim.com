var userPath;
var drawnPaths = [];
var eraserPath;
var curRedraw;
var pathItr = 0;
var segItr = 0;
var color = "#333333";

var xmin;
var xmax;
var ymin;
var ymax;

var stroke = 3;
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

paper.install(window);

window.onload = function(){
	canvas = document.getElementById("gameCanvas");
	canvas.style.backgroundColor = "#FFFFFF";
	canvas.style.width = "100%";
	canvas.style.height = "100%";
	
	paper.setup(canvas);
	
	var drawArea = new paper.Path.Rectangle(0, 0, canvas.width/2, canvas.height);

	drawArea.fillColor = "#FFFFFF";
	curRedraw = new paper.Path();
	curRedraw.strokeColor = "#333333";
	curRedraw.strokeWidth = stroke;

	xmin = canvas.width/2;
	xmax = 0;
	ymin = canvas.height;
	ymax = 0;

	var tool = new Tool();
	tool.onMouseDown = function(event){
		if(drawArea.bounds.contains(event.point)){
				userPath = new paper.Path({
				segments: [event.point],
				strokeColor: color,
				strokeWidth:stroke
			});
			if(event.point.x > xmax){
				xmax = event.point.x;
			}
			if(event.point.x < xmin){
				xmin = event.point.x;
			}
			if(event.point.y > ymax){
				ymax = event.point.y;
			}
			if(event.point.y < ymin){
				ymin = event.point.y;
			}
			animate = false;
		}
	}
	tool.onMouseDrag = function(event){
		if(drawArea.bounds.contains(event.point)){
			userPath.add(event.point);
			if(event.point.x > xmax){
				xmax = event.point.x;
			}
			if(event.point.x < xmin){
				xmin = event.point.x;
			}
			if(event.point.y > ymax){
				ymax = event.point.y;
			}
			if(event.point.y < ymin){
				ymin = event.point.y;
			}
		}else{
			userPath.simplify(2);
			drawnPaths.push(userPath);
			animate = true;
		}
	}
	tool.onMouseUp = function(event){
		if(drawArea.bounds.contains(event.point)){
			if(event.point.x > xmax){
				xmax = event.point.x;
			}
			if(event.point.x < xmin){
				xmin = event.point.x;
			}
			if(event.point.y > ymax){
				ymax = event.point.y;
			}
			if(event.point.y < ymin){
				ymin = event.point.y;
			}
			userPath.simplify(2);
			drawnPaths.push(userPath);
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

function redraw(){
	if(pathItr == drawnPaths.length && drawing){
		eraserStartLeft = !eraserStartLeft;
		drawing = false;
		erasing = true;
		var eraserXMin = xmin+canvas.width/2 - 50;
		var eraserXMax = xmax+canvas.width/2 + 50;
		eraser = new cpuEraser(eraserXMin, eraserXMax, ymin - 50, ymax + 50, eraserStartLeft);
		
		if(typeof(eraserPath3) != 'undefined'){
			eraserPath3.remove();
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

		eraserPath = new paper.Path();
		eraserPath.strokeWidth = 60;
		eraserPath.strokeColor = "#FFFFFF";
		eraserPath.strokeColor.alpha = .6;
		pathItr = 0;
		segItr = 0;
	}else if(pathItr < drawnPaths.length && 
		segItr == drawnPaths[pathItr].segments.length &&
		drawing){
		pathItr++;
		redrawnPaths1.push(curRedraw);
		curRedraw = new paper.Path();
		curRedraw.strokeColor = "#333333";
		curRedraw.strokeWidth = stroke;
		segItr = 0;
	}else if(segItr < drawnPaths[pathItr].segments.length &&
		drawing){
		var path = drawnPaths[pathItr];
		var segment = path.segments[segItr];
		var x = segment.point.x + getRandomInt(-10, 10);
		var y = segment.point.y + getRandomInt(-10, 10);
		var point = new Point(x + canvas.width/2, y);
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

class cpuEraser{
	constructor(x_min, x_max, y_min, y_max, startLeft){
		this.strokeWidth = 50;
		this.xmin = x_min + this.strokeWidth/2;
		this.xmax = x_max - this.strokeWidth/2;
		this.ymin = y_min + this.strokeWidth/2;
		this.ymax = y_max - this.strokeWidth/2;
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