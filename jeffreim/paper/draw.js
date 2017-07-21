var userPath;
var drawnPaths = [];
var redrawnPaths = [];
var draw = true;
var color = "#333333";
var stroke = 3;

function onMouseDown(event){
	userPath = new Path({
		segments: [event.point],
		strokeColor: color,
		strokeWidth:stroke
	});
	draw = false;
}

function onMouseDrag(event){
	userPath.add(event.point);
}

function onMouseUp(event){
	userPath.simplify(10);
	drawnPaths.push(userPath);
	redraw();
	draw = true;
	if(color == "#333333"){
		color = "#FFFFFF";
		stroke = 10;
	}else{
		color = "#333333";
		stroke = 3;
	}
}

function redraw(){
	for(var i = 0; i < drawnPaths.length; i++){
		var path = drawnPaths[i];
		var redonePath = new Path();
		for(var s = 0; s < path.segments.length; s++){
			var point = path.segments[s].point;
			point.x += getRandomInt(-5,5);
			point.y += getRandomInt(-5,5);
			var newSegment = new Segment(point, 
								path.segments[s].handleIn, 
								path.segments[s].handleOut);
			redonePath.add(newSegment);
		}
	}
}

function onFrame(event){
	if(draw && drawnPaths.length > 0){
		redraw();
	}
}