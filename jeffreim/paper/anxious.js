var userPath;
var drawnPaths = [];
var redrawnPaths = [];
var draw = true;
var color = "#333333";
var stroke = 3;
var canvas;

paper.install(window);

window.onload = function(){
	canvas = document.getElementById("gameCanvas");
	canvas.style.backgroundColor = "#BB0000";
	canvas.style.width = "100%";
	canvas.style.height = "100%";
	
	paper.setup(canvas);

	var tool = new Tool();
	tool.onMouseDown = function(event){
			userPath = new paper.Path({
			segments: [event.point],
			strokeColor: color,
			strokeWidth:stroke
		});
		draw = false;
	}
	tool.onMouseDrag = function(event){
		userPath.add(event.point);
	}
	tool.onMouseUp = function(event){
		userPath.simplify(10);
		drawnPaths.push(userPath);
		draw = true;
		if(color == "#333333"){
			color = "#FFFFFF";
			stroke = 10;
		}else{
			color = "#333333";
			stroke = 3;
		}
	}
	

	if(window.innerWidth > 700){
		canvas.style.cursor = "none";
		var middle = new paper.Point(window.innerWidth/2, window.innerHeight/2);
		var mouse = new paper.Path.Circle(middle, 5);
		mouse.fillColor = "#000000";
		tool.onMouseMove = function(event){
			mouse.position = event.point;
		}
	}

	view.onFrame = function(event){
		if(draw && drawnPaths.length > 0){
			redraw();
		}
	}
}

function redraw(){
	for(var i = 0; i < drawnPaths.length; i++){
		var path = drawnPaths[i];
		for(var s = 0; s < path.segments.length; s++){
			var point = path.segments[s].point;
			point.x += getRandomInt(-5,5);
			point.y += getRandomInt(-5,5);
		}
		path.simplify(2);
	}
}