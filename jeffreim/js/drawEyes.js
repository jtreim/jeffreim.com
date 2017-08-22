
function getRandomFloat(min, max){
	return Math.random() * (max-min) + min;
}
function getRandomInt(min, max){
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max-min+1)) + min;
}

function getDist(x, y, _x, _y){
	var dx = _x - x;
	var dy = _y - y;
	return Math.sqrt((Math.pow(dx,2) + Math.pow(dy,2)));
}

function getEraseBounds(){
	var x = window.innerWidth;
	var _x = 0;
	var y = window.innerHeight;
	var _y = 0;
	for(var i = 0; i < drawnEyes.length; i++){
		for(var j = 0; j < drawnEyes[i].length; j++){
			var b = drawnEyes[i][j].getBoundaries();
			if(b.x < x){
				x = b.x;
			}
			if(b._x > _x){
				_x = b._x;
			}
			if(b.y < y){
				y = b.y;
			}
			if(b._y > _y){
				_y = b._y;
			}
		}
	}
	var w = _x - x;
	var h = _y - y;
	return {x:x, y:y, _x:_x, _y:_y, w:w, h:h};
}

class PointNamePair{
	constructor(x, y, name){
		this.point = {
			x: x,
			y: y
		};
		this.name = name;
	}
	equals(pnp){
		return (
			pnp instanceof PointNamePair &&
			this.point.x == pnp.point.x &&
			this.point.y == pnp.point.y &&
			this.name == pnp.name);
	}
}

class Eye{
	constructor(x, y, w, h, side){
		this.pos = {
			x: x,
			y: y
		};
		this.size = {
			w: w,
			h: h
		};
		this.points = [];
		var src;
		if(side == RIGHT){
			src = RIGHT_EYE;
		}else{
			src = LEFT_EYE;
		}

		var pnp = src[0];
		var x = pnp.point.x * this.size.w + this.pos.x;
		var y = pnp.point.y * this.size.h + this.pos.y;
		this.points.push(new PointNamePair(x, y, pnp.name)); 
		
		for(var i = 1; i < src.length - 1; i++){
			pnp = src[i];
			x = (pnp.point.x + getRandomFloat(-.03, .03)) * this.size.w + this.pos.x;
			y = (pnp.point.y + getRandomFloat(-.03, .03)) * this.size.h + this.pos.y;
			this.points.push(new PointNamePair(x, y, pnp.name));
		}

		pnp = src[0];
		x = pnp.point.x * this.size.w + this.pos.x;
		y = pnp.point.y * this.size.h + this.pos.y;
		this.points.push(new PointNamePair(x, y, pnp.name)); 

		this.pointItr = 0;
		this.side = side;
		this.path = new paper.Path();
	}
	isLeft(){
		return(this.side == LEFT);
	}
	isRight(){
		return(this.side == RIGHT);
	}
	getPoint(){
		if(this.pointItr >= this.points.length || this.pointItr < 0){
			return null;
		}else{
			return this.points[this.pointItr].point;
		}
	}
	getPrevPoint(){
		if(this.pointItr == 0 || this.pointItr - 1 >= this.points.length){
			return null;
		}else{
			return this.points[this.pointItr - 1].point;
		}
	}
	getBoundaries(){
		var x;
		var _x;
		var y;
		var _y;
		if(this.side == LEFT){
			x = this.pos.x - ERASE_BUFFER;
			_x = this.pos.x + this.size.w + ERASE_BUFFER;
			y = this.pos.y + LEFT_EYE[2].point.y * this.size.h - ERASE_BUFFER;
			_y = this.pos.y + LEFT_EYE[8].point.y * this.size.h + ERASE_BUFFER;
		}else{
			x = this.pos.x - this.size.w - ERASE_BUFFER;
			_x = this.pos.x + ERASE_BUFFER;
			y = this.pos.y + RIGHT_EYE[2].point.y * this.size.h - ERASE_BUFFER;
			_y = this.pos.y + RIGHT_EYE[8].point.y * this.size.h + ERASE_BUFFER;
		}
		return { x:x, y:y, _x:_x, _y:_y };
	}
}

class Eraser{
	constructor(){
		this.bounds = {
			x:0,
			y:0,
			_x:0,
			_y:0,
			w:0,
			h:0
		};
		this.x = 0;
		this.y = 0;
		this.cnt = 0;
		this.working = false;
		this.path = null;
	}
	erase(cnt){
		// RETURN: false if done erasing.
		// Starting to erase
		if(!this.path){
			this.path = new paper.Path();
			this.path.strokeColor = WHITE;
			this.path.strokeColor.alpha = ERASER_ALPHA;
			this.path.strokeWidth = ERASER_STROKE;

			this.x = this.bounds.x;

			this.y = this.bounds.y;
			this.path.add(new paper.Point(this.x, this.y));
			this.cnt = 0;

		// Reached end of erasing
		}else if(this.cnt == cnt){
			eraserPaths.push(this.path);
			this.path = null;
			return false;
		}
		
		// Otherwise, keep erasing on current line
		this.eraseLine(cnt);
		return true;
	}

	eraseLine(cnt){
		var x;
		var _x;
		var _y = this.bounds.y + this.bounds.h/cnt * (1 + this.cnt);

		if(this.cnt % 2 == 0){
			x = this.bounds.x;
			_x = this.bounds._x;
		}else{
			x = this.bounds._x;
			_x = this.bounds.x;
		}

		var diff = getDist(this.x, this.y, _x, _y);
		if(diff <= ERASE_SPD){
			this.path.add(new paper.Point(_x, _y));
			this.x = _x;
			this.y = _y;
			this.cnt++;
		}else{
			var dx = _x - x;
			var dy = this.bounds.h/cnt;

			this.x += dx/ERASE_SPD;
			this.y += dy/ERASE_SPD;

			this.path.add(new paper.Point(this.x, this.y));
		}
	}
}

class Artist{
	constructor(){
		this.pencil = {
			x: 0,
			y: 0
		};
		this.working = false;
		this.eye = null;
	}
	draw(){
		// RETURN: true if still drawing, false if done drawing left & right eyes
		// Starting new left eye
		if(!this.eye){
			var w = getRandomFloat(MIN_EYELINE_W,MAX_EYELINE_W) * window.innerWidth;
			var h = getRandomFloat(MIN_EYE_H,MAX_EYE_H) * window.innerHeight;
			this.pencil.x = (window.innerWidth - w)/2;
			this.pencil.y = getRandomFloat(MIN_EYELINE_H,MAX_EYELINE_H) * window.innerHeight;

			this.eye = new Eye(this.pencil.x, this.pencil.y, 
				w/(getRandomInt(MIN_EYE_SPACING,MAX_EYE_SPACING)), h, LEFT);
			this.eye.path.strokeColor = PENCIL;
			this.eye.path.strokeWidth = ARTIST_STROKE;

		// Finished left eye, starting right
		}else if(this.eye.isLeft() && 
			this.eye.pointItr == this.eye.points.length){
			currentEyes.push(this.eye);

			var w = getRandomFloat(MIN_EYELINE_W,MAX_EYELINE_W) * window.innerWidth;
			var h = getRandomFloat(MIN_EYE_H,MAX_EYE_H) * window.innerHeight;
			this.pencil.x = window.innerWidth - (window.innerWidth - w)/2;
			this.pencil.y = getRandomFloat(MIN_EYELINE_H,MAX_EYELINE_H) * window.innerHeight;

			this.eye = new Eye(this.pencil.x, this.pencil.y,
				w/(getRandomInt(MIN_EYE_SPACING,MAX_EYE_SPACING)), h, RIGHT);
			this.eye.path.strokeColor = PENCIL;
			this.eye.path.strokeWidth = ARTIST_STROKE;

		// Finished both eyes
		}else if(this.eye.isRight() && 
			this.eye.pointItr == this.eye.points.length){
			currentEyes.push(this.eye);
			this.eye = null;
			return false;
		}

		// Otherwise, continue drawing current eye
		this.drawEye();
		return true;
	}

	drawEye(){
		var p = this.eye.getPoint();
		var diff = getDist(this.pencil.x, this.pencil.y, p.x, p.y);
		
		// Finished drawing up to current point
		if(diff <= DRAW_SPD){
			this.eye.path.add(p);
			this.pencil.x = p.x;
			this.pencil.y = p.y;
			this.eye.pointItr++;
			this.eye.path.simplify(1)
		}else{
			var dx = p.x - this.eye.getPrevPoint().x;
			var dy = p.y - this.eye.getPrevPoint().y;

			dx /= DRAW_SPD;
			dy /= DRAW_SPD;

			this.pencil.x += dx;
			this.pencil.y += dy;

			this.eye.path.add(new paper.Point(this.pencil.x, this.pencil.y));
		}
	}
}

var ratio = {
	x: 1,
	y: 1
};
var oldWidth;
var oldHeight;
var resized = false;

var artist = new Artist();
var eraser = new Eraser();
var eraserLineCnt = 0;

const MIN_ERASE_LINES = 8;
const MAX_ERASE_LINES = 12;

const WHITE = "#FFFFFF";
const ERASER_ALPHA = .8;
const PENCIL = "#333333";

const LEFT_EYE = [new PointNamePair(0,0, " start"),
		new PointNamePair(.25, -.3, " top lid left"), new PointNamePair(.75, -.5, " top lid center"),
		new PointNamePair(.9, -.1, " top lid right"), new PointNamePair(1, 0, " top lid tear duct"),
		new PointNamePair(.95, .1, " side tear duct"), new PointNamePair(.9, .05, " lower lid tear duct"),
		new PointNamePair(.85, .1, " lower lid right"), new PointNamePair(.3, .3, " lower lid center"),
		new PointNamePair(0, 0, " lower lid left")];
const RIGHT_EYE = [new PointNamePair(0,0, " start"),
		new PointNamePair(-.25, -.3, " top lid right"), new PointNamePair(-.75, -.5, " top lid center"),
		new PointNamePair(-.9, -.1, " top lid left"), new PointNamePair(-1, 0, " top lid tear duct"),
		new PointNamePair(-.95, .1, " side tear duct"), new PointNamePair(-.9, .05, " lower lid tear duct"),
		new PointNamePair(-.85, .1, " lower lid left"), new PointNamePair(-.3, .3, " lower lid center"),
		new PointNamePair(0, 0, " lower lid right")];
const LEFT = "left";
const RIGHT = "right";
const MIN_EYE_H = .05;
const MAX_EYE_H = .4;
const MIN_EYELINE_W = .4;
const MAX_EYELINE_W = .8;
const MIN_EYELINE_H = .4;
const MAX_EYELINE_H = .6;
const MIN_EYE_SPACING = 2;
const MAX_EYE_SPACING = 4;
const ERASE_BUFFER = 5;

var userPath;
var drawnEyes = [];
var eraserPaths = [];
var currentEyes = [];

const DRAW_SPD = 8;
const ERASE_SPD = 5;
const ARTIST_STROKE = 5;
const ERASER_STROKE = 50;

const MAX_LAYERS = 3;

paper.install(window);

window.onload = function(){
	canvas = document.getElementById("gameCanvas");
	canvas.style.backgroundColor = WHITE;
	canvas.style.width = "100%";
	canvas.style.height = "100%";

	oldWidth = window.innerWidth;
	oldHeight = window.innerHeight;

	paper.setup(canvas);

	view.onFrame = function(event){
		if(!artist.working && !eraser.working && resized){
			resizeCanvas();
		}
		if(!artist.working && !eraser.working){
			artist.working = true;
			artist.draw();
		}else if(artist.working && !artist.draw()){
			drawnEyes.push(currentEyes);
			currentEyes = [];
			artist.working = false;
			eraser.working = true;
			eraserLineCnt = getRandomInt(MIN_ERASE_LINES, MAX_ERASE_LINES);
			eraser.bounds = getEraseBounds();
		}else if(eraser.working && !eraser.erase(eraserLineCnt)){
			eraser.working = false;
			if(drawnEyes.length == MAX_LAYERS){
				drawnEyes[0][0].path.remove();
				drawnEyes[0][1].path.remove();
				drawnEyes.splice(0,1);
			}
			if(eraserPaths.length == MAX_LAYERS){
				eraserPaths[0].remove();
				eraserPaths.splice(0,1);
			}
		}
	}
}

$(document).ready(function(){
	window.addEventListener("resize", function(event){
		resized = true;
	});
});

function resizeCanvas(){
	ratio.x = window.innerWidth/oldWidth;
	ratio.y = window.innerHeight/oldHeight;
	oldWidth = window.innerWidth;
	oldHeight = window.innerHeight;
	resized = false;
}