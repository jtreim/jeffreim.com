
function getRandomFloat(min, max){
	return Math.random() * (max-min) + min;
}
function getRandomInt(min, max){
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max-min+1)) + min;
}

class Line{
	constructor(x, y, _x, _y name){
		this.pos={
			x: x,
			y: y,
			_x: x,
			_y: y
		};
		this.name = name;
	}
	equals(l){
		if(!(l instanceof Line)){ return false; }
		if(l.pos.x == this.pos.x &&
			l.pos.y == this.pos.y &&
			l.pos._x == this.pos._x &&
			l.pos._y == this.pos._y &&
			l.name == this.name){ return true; }
		else{
			return false;
		}
	}
}

class Eye{
	constructor(sx, sy, w, h, side){
		this.lines = [];
		if(side == "left"){
			for(var i = 0; i < EYE_LINE_CNT; i++){
				var x = LEFT_EYE[i].x + sx;
				var y = LEFT_EYE[i].y + sy;
				var _x = LEFT_EYE[i].x + sx + LEFT_EYE[i]._x * w;
				var _y = LEFT_EYE[i].y + sy + LEFT_EYE[i]._y * h;
				var name = LEFT_EYE[i].name;
				this.lines.push(new Line(x, y, _x, _y, name));
			}
		}else if(side == "right"){
			for(var i = 0; i < EYE_LINE_CNT; i++){
				var x = RIGHT_EYE[i].x + sx;
				var y = RIGHT_EYE[i].y + sy;
				var _x = RIGHT_EYE[i].x + sx + RIGHT_EYE[i]._x * w;
				var _y = RIGHT_EYE[i].y + sy + RIGHT_EYE[i]._y * h;
				var name = RIGHT_EYE[i].name;
				this.lines.push(new Line(x, y, _x, _y, name));
			}
		}
	}
	equals(e){
		if(!(e instanceof Eye)){ return false; }
		if(e.lines == null || e.lines.length != this.lines.length){ return false; }
		for(var i = 0; i < this.lines.length; i++){
			if(!e.lines[i].equals(this.lines[i])){ return false; }
		}
	}
}

const LEFT_EYE = [new Line(0, 0, .25, -.3, " top lid left"), new Line(.25, -.3, .75, -.5, " top lid center"),
		new Line(.75, -.5, .9, -.1, " top lid right"), new Line(.9, -.1, 1, 0, " top lid tear duct"),
		new Line(1, 0, .95, .1, " side tear duct"), new Line(.95, .1, .9, .05, " lower lid tear duct"),
		new Line(.9, .05, .85, .1, " lower lid right"), new Line(.85, .1, .3, .3, " lower lid center"),
		new Line(.3, .3, 0, 0, " lower lid left")];
const RIGHT_EYE = [new Line(0, 0, -.25, -.3, " top lid right"), new Line(-.25, -.3, -.75, -.5, " top lid center"),
		new Line(-.75, -.5, -.9, -.1, " top lid left"), new Line(-.9, -.1, -1, 0, " top lid tear duct"),
		new Line(-1, 0, -.95, .1, " side tear duct"), new Line(-.95, .1, -.9, .05, " lower lid tear duct"),
		new Line(-.9, .05, -.85, .1, " lower lid left"), new Line(-.85, .1, -.3, .3, " lower lid center"),
		new Line(-.3, .3, 0, 0, " lower lid right")];

var width;
var height;

const PENCIL_FILL = 0x444444;
const ERASER_FILL = 0xFFFFFF;
const PENCIL_SPD = 5;
const ERASER_W = 30;

var drawnEyes = [];
var eraserLines = [];

const MAX_LAYERS = 3;
const EYE_LINE_CNT = LEFT_EYE.length;

class Artist{
	constructor(){
		this.stroke = {
			fill: PENCIL_FILL,
			spd: PENCIL_SPD
		};

		this.working = false;

		this.current == null;
		this.finished = [];

		var w = getRandomFloat(width*.3, width*.5);
		var h = getRandomFloat(height*.3, height*.4);
		this.eyeline = {
			w: w,
			h: h
		};
		
		w /= (getRandomInt(2,6));
		var m = 1/(getRandomInt(2,6));
		m = Math.abs(2 - m);
		h = this.eyeline.w / m;
		this.eye = {
			w: w,
			h: h
		};

		var x = width - this.eyeline.w;
		x = x/2;
		this.pencil = {
			x: x,
			y: this.eyeline.h
		};
	}

	drawLine(line){
		if(this.current == null){
			this.pencil.x = line.x;
			this.pencil.y = line.y;
			this.current = line;
		}

		var dx = line._x - this.pencil.x;
		var dy = line._y - this.pencil.y;
		var diff = Math.pow(dx,2) + Math.pow(dy,2);
		diff = Math.sqrt(diff);
		
		if(diff <= PENCIL_SPD){
			this.pencil.x = line._x;
			this.pencil.y = line._y;
			this.finished.push(line);
			this.current = null;
		}else{
			var m = diff / (this.stroke.spd);
			this.pencil.x += dx/m;
			this.pencil.y += dy/m;
		}
	}

	drawEyes(){
		if(this.current == null && this.finished.length == 2 * EYE_LINE_CNT){
		
			this.working = false;

			var r = new Eye(this.pencil.x, this.pencil.y, this.eye.w, this.eye.h, "right");
			drawnEyes.push(r);

			this.finished = [];

			this.eyeline.w = getRandomFloat(width*.3, width*.5);
			this.eyeline.h = getRandomFloat(height*.3, height*.4);

			this.eye.w = this.eyeline.w/(getRandomInt(2,6));
			var m = 1/(getRandomInt(2,6));
			m = Math.abs(2 - m);
			this.eye.h = this.eye.w / m;

			var x = width - this.eyeline.w;
			x = x/2;
			this.pencil.x = x;
			this.pencil.y = this.eyeline.h;
		}else if(this.finished.length > EYE_LINE_CNT && this.finished.length < 2 * EYE_LINE_CNT){
			this.drawRightEye();
		}else if(this.current == null && this.finished.length == EYE_LINE_CNT){
			var num = getRandomInt(1, 5);

			switch(num){
				case 1:
					this.eyeline.h += height*getRandomFloat(-.01,.03);
					break;
				case 2:
					this.eyeline.h += width*getRandomFloat(-.03,.03);
					break;
				case 3:
					this.eyeline.h += height*getRandomFloat(-.01,.03);
					this.eyeline.w += width*getRandomFloat(-.04,.04);
					break;
				default:
					break;
			}
			this.eye.w = this.eyeline.w/(getRandomInt(2,6));
			var m = 1/getRandomFloat(2,6);
			m = Math.abs(2-m);
			this.eye.h = this.eye.w/m;
			this.pencil.x = width - (width - this.eyeline.w)/2;
			this.pencil.y = this.eyeline.h;
			this.drawRightEye();
		}else{
			var x = width - this.eyeline.w;
			x = x/2;
			this.drawLeftEye();
		}
	}

	drawLeftEye(){
		var line;
    	if(this.current == null && this.finished.length > 0){
    		var _x = (width - this.eyeline.w)/2;
    		var _y = this.eyeline.h;
    		var name;
    		var last = this.finished[this.finished.length - 1];
    		for(var i = 0; i < EYE_LINE_CNT; i++){
    			if(last.name == LEFT_EYE[i].name){
    				_x += this.eye.w*LEFT_EYE[i]._x;
    				_y += this.eye.h*LEFT_EYE[i]._y;
    				name = LEFT_EYE[i].name;
    				break;
    			}
    		}
    		line = new Line(last._x, last._y, x, y, name);
    	}else if(current != null){
    		line = current;
    	}else{
    		var _x = (width - this.eyeline.w)/2 + this.eye.w*LEFT_EYE[0]._x;
    		var _y = this.eyeline.h + this.eye.h*LEFT_EYE[0]._y;
    		var name = LEFT_EYE[0].name;
    		line = new Line(this.pencil.x, this.pencil.y, _x, _y, name);
    	}
    	
    	this.drawLine(line);
	}

	drawRightEye(){
		var line;
    	if(this.current == null && this.finished.length > EYE_LINE_CNT){
    		var _x = (width - this.eyeline.w)/2;
    		var _y = this.eyeline.h;
    		var name;
    		var last = this.finished[this.finished.length - 1];
    		for(var i = 0; i < EYE_LINE_CNT; i++){
    			if(last.name == RIGHT_EYE[i].name){
    				_x += this.eye.w*RIGHT_EYE[i]._x;
    				_y += this.eye.h*RIGHT_EYE[i]._y;
    				name = RIGHT_EYE[i].name;
    				break;
    			}
    		}
    		line = new Line(last._x, last._y, x, y, name);
    	}else if(current != null){
    		line = current;
    	}else{
    		var _x = (width - this.eyeline.w)/2 + this.eye.w*RIGHT_EYE[0]._x;
    		var _y = this.eyeline.h + this.eye.h*RIGHT_EYE[0]._y;
    		var name = RIGHT_EYE[0].name;
    		line = new Line(this.pencil.x, this.pencil.y, _x, _y, name);
    	}
    	this.drawLine(line);
	}

	resize(){
		this.eyeline.w = getRandomFloat(width*.3, width*.5);
		this.eyeline.h = getRandomFloat(height*.3, height*.4);

		this.eye.w = this.eyeline.w/(getRandomInt(2,6));
		var m = 1/(getRandomInt(2,6));
		m = Math.abs(2 - m);
		this.eye.h = this.eye.w / m;

		var x = width - this.eyeline.w;
		x = x/2;
		this.pencil.x = x;
		this.pencil.y = this.eyeline.h;
	}
}
class Eraser{
	constructor(){
		this.stroke = {
			w: ERASER_W,
			fill: ERASER_FILL
		};

		var w = getRandomFloat(width*.5, width*.8);
		var h = getRandomFloat(height*.1, height*.5);
		this.size = {
			w: w,
			h: h
		};
		this.count = 0;

		var x = (width - this.size.w)/2;
		var y = (height - this.size.h)/2;
		this.pos = {
			x: x,
			y: y
		}; 
    	this.working = false;
	}

	eraseAll(count){
		if(this.count == count) {
      		this.size.w = getRandomFloat(width*.5, width*.8);
      		this.size.h = getRandomFloat(height*.1, height*.5);
      		this.count = 0;
      		this.pos.x = (width - this.size.w)/2;
      		this.pos.y = (height - this.size.h)/2;
      		return false;
    	}
    	var ratio = this.count/count;
       	var x;
    	var y = (height - this.size.h)/2 + this.size.h*ratio - 105;
    	if(this.count%2 == 0)	{
      		x = width - (width - this.erase_width)/2;
    	} else {
      		x = (this.WIDTH - this.erase_width)/2;
    	}
    	x -= 15;
    	this.eraseLine(x, y);
    	return true;
	}

	eraseLine(x_end, y_end){
    	var x_dist = x_end - this.eraser_x;
    	var y_dist = y_end - this.eraser_y;
    	var difference = Math.pow(x_dist, 2) + Math.pow(y_dist, 2);                             
    	difference = Math.sqrt(difference);
    	if(difference <= this.stroke_width/2){										// Checks if line is done.
    		this.erase_count++;
    	} else {
      		var slope_fraction = difference / (this.stroke_width*.75);
      		this.eraser_x += x_dist/slope_fraction;
      		this.eraser_y += y_dist/slope_fraction;
    	}
	}

	changeCanvas(){
		this.WIDTH = window.innerWidth;
		this.HEIGHT = window.innerHeight;

		this.erase_width = getRandomFloat(this.WIDTH*.5, this.WIDTH*.8);
    	this.erase_height = getRandomFloat(this.HEIGHT*.1, this.HEIGHT*.5);
    	this.erase_count = 0;
    	this.eraser_x = (this.WIDTH - this.erase_width)/2;
    	this.eraser_y = (this.HEIGHT - this.erase_height)/2 - 105;
	}
}

var artist = new Artist();
var eraser = new Eraser();
var graphics = new PIXI.Graphics();
var stage = new PIXI.Container();
var resized = false;
var erase_cnt = getRandomInt(8,15);

function setup(){
	canvas = document.getElementById("gameCanvas");
	rendererOptions = { view: canvas, antialias: false, transparent: false, resolution:1 };
	autoDetectRenderer = PIXI.autoDetectRenderer;
	renderer = autoDetectRenderer(window.innerWidth, window.innerHeight, rendererOptions);
	renderer.backgroundColor = 0xFFFFFF;
	stage.addChild(graphics);
	animate();
}

function animate(){
	renderer.render(stage);
	for(var i = 0; i < 3; i++){
		if(!artist.working && !eraser.working && resized){
			resize();
		}else if(!artist.working && !eraser.working){
			artist.working = true;
			artist.drawEyes();
		}else if(artist.working && !eraser.working && !artist.drawEyes()){
			eraser.working = true;
			artist.working = false;
			erase_cnt = getRandomInt(8,15);
			eraser.eraseAll(erase_cnt);
		}else if(!artist.working && eraser.working && !eraser.eraseAll(erase_cnt)){
			eraser.working = false;
		}
		if(artist.working){
			graphics.beginFill(artist.fill, 1);
			graphics.drawEllipse(artist.pencil_x, artist.pencil_y, artist.stroke_width, artist.stroke_width);
			graphics.endFill();
		}else if(eraser.working){
			graphics.beginFill(0xFFFFFF, eraser.opacity);
			graphics.drawEllipse(eraser.eraser_x, eraser.eraser_y, eraser.stroke_width, eraser.stroke_width);
			graphics.endFill();
		}
	}
	requestAnimationFrame(animate);
}

$(document).ready(function(){
	window.addEventListener("resize", function(event){
		renderer.view.autoResize = true;
		renderer.resize(window.innerWidth, window.innerHeight);
		resized = true;
	});
	setup();
});

function resize(){
	resized = false;
	width = window.innerWidth;
	height = window.innerHeight;
	artist.resize();
	eraser.resize();
}