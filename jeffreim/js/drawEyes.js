
function getRandomFloat(min, max){
	return Math.random() * (max-min) + min;
}
function getRandomInt(min, max){
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max-min+1)) + min;
}

class Line{
	constructor(x_multiplier, y_multiplier, name){
		this.x_multiplier = x_multiplier;
		this.y_multiplier = y_multiplier;
		this.name = name;
	}
	x(){
		return this.x_multiplier;
	}
	y(){
		return this.y_multiplier;
	}
}
class Artist{
	constructor(){
		this.WIDTH = window.innerWidth;
		this.HEIGHT = window.innerHeight;
		this.stroke_width = .5;
		this.fill = 0x444444;
		
		this.working = false;
		this.working_on = "draw: ";
		this.finished = "finished:";
		
		this.eyeline_width = getRandomFloat(this.WIDTH*.3, this.WIDTH*.5);
		this.eyeline_height = getRandomFloat(this.HEIGHT*.3, this.HEIGHT*.4);

		this.eye_width = this.eyeline_width/(getRandomInt(2,6));
		var multiplier = 1/(getRandomInt(2,6));
		multiplier = Math.abs(2 - multiplier);
		this.eye_height = this.eye_width / multiplier;

		var x = this.WIDTH - this.eyeline_width;
		x = x/2;
		this.pencil_x = x;
		this.pencil_y = this.eyeline_height;

		this.left_eye = 
		[new Line(.25, -.3, " top lid left"), new Line(.75, -.5, " top lid center"),
		new Line(.9, -.1, " top lid right"), new Line(1, 0, " top lid tear duct"),
		new Line(.95, .1, " side tear duct"), new Line(.9, .05, " lower lid tear duct"),
		new Line(.85, .1, " lower lid right"), new Line(.3, .3, " lower lid center"),
		new Line(0, 0, " lower lid left")];
		
		this.right_eye =
		[new Line(-.25, -.3, " top lid right"), new Line(-.75, -.5, " top lid center"),
		new Line(-.9, -.1, " top lid left"), new Line(-1, 0, " top lid tear duct"),
		new Line(-.95, .1, " side tear duct"), new Line(-.9, .05, " lower lid tear duct"),
		new Line(-.85, .1, " lower lid left"), new Line(-.3, .3, " lower lid center"),
		new Line(0, 0, " lower lid right")];
	}

	drawLine(x_end, y_end, max_stroke, line_name){
		var x_dist = x_end - this.pencil_x;
		var y_dist = y_end - this.pencil_y;
		var difference = Math.pow(x_dist,2) + Math.pow(y_dist,2);
		difference = Math.sqrt(difference);
		if(!this.working_on.includes(line_name)){
			this.working_on += line_name;
			this.stroke_width = .5;
		}else if(difference <= 1.2){
			var line_name_start = this.working_on.indexOf(line_name);
			this.working_on = this.working_on.substring(0, line_name_start);
			this.finished += line_name;
		}else{
			if(this.stroke_width < max_stroke && difference > (Math.pow(max_stroke,2)/2.5)){
				this.stroke_width += .5;
			}
			var slope_fraction = difference / (this.stroke_width *1.2);
			this.pencil_x += x_dist/slope_fraction;
			this.pencil_y += y_dist/slope_fraction;
		}
	}

	drawEyes(){
		if(!this.working_on.includes("right eye") && this.finished.includes("and right eye")){
			this.stroke_width = .5;
			this.fill = 0x000000;
		
			this.working = false;
			this.finished = "finished:";
		
			this.eyeline_width = getRandomFloat(this.WIDTH*.3, this.WIDTH*.5);
			this.eyeline_height = getRandomFloat(this.HEIGHT*.3, this.HEIGHT*.4);

			this.eye_width = this.eyeline_width/(getRandomInt(2,6));
			var multiplier = 1/(getRandomInt(2,6));
			multiplier = Math.abs(2 - multiplier);
			this.eye_height = this.eye_width / multiplier;

			var x = this.WIDTH - this.eyeline_width;
			x = x/2;
			this.pencil_x = x;
			this.pencil_y = this.eyeline_height;

			return false;
		}else if(this.working_on.includes("right eye") && !this.finished.includes("and right eye")){
			if(!this.drawRightEye())
			{
				this.working_on = "draw: ";
				this.finished = "finished: left eye and right eye";
			}
		}else if(this.working_on.includes("left eye") && !this.finished.includes("left eye")){
			if(!this.drawLeftEye()){
				this.finished = "finished: left eye";
				this.working_on = "draw: right eye";
				var num = getRandomInt(1, 5);

				switch(num){
					case 1:
						this.eyeline_height += this.HEIGHT*getRandomFloat(-.01,.03);
						break;
					case 2:
						this.eyeline_height += this.WIDTH*getRandomFloat(-.03,.03);
						break;
					case 3:
						this.eyeline_height += this.HEIGHT*getRandomFloat(-.01,.03);
						this.eyeline_width += this.WIDTH*getRandomFloat(-.04,.04);
						break;
					default:
						break;
				}
				this.eye_width = this.eyeline_width/(getRandomInt(2,6));
				var size_multiplier = 1/getRandomFloat(2,6);
				size_multiplier = Math.abs(2-size_multiplier);
				this.eye_height = this.eye_width/size_multiplier;
				this.pencil_x = this.WIDTH - (this.WIDTH - this.eyeline_width)/2;
				this.pencil_y = this.eyeline_height;
			}
		}else if(!this.working_on.includes("left eye") && !this.finished.includes("left eye")){
			var x = this.WIDTH - this.eyeline_width;
			x = x/2;
			this.working_on += "left eye";
			this.drawLeftEye();
		}
		return true;
	}

	drawLeftEye(){
		var last_line = this.left_eye[(this.left_eye.length - 1)].name;

		if(!this.working_on.includes(last_line) && 						// Finished drawing the left eye. 
		this.finished.includes(last_line)) 
    	{
    	  return false;
    	}
    	var x = (this.WIDTH - this.eyeline_width)/2;
    	var y = this.eyeline_height;
    	var line_name;
    	for(var i = 0; i < this.left_eye.length; i++){					// Otherwise, working on a line.
    		if(!this.finished.includes(this.left_eye[i].name)){
    			x += this.eye_width*this.left_eye[i].x();
    			y += this.eye_height*this.left_eye[i].y();
    			line_name = this.left_eye[i].name;
    			break;
    		}
    	}
    	this.drawLine(x, y, 2, line_name);
    	return true;
	}

	drawRightEye(){
		var last_line = this.right_eye[(this.right_eye.length - 1)].name;

		if(!this.working_on.includes(last_line) && 						// Finished drawing the left eye. 
		this.finished.includes(last_line)) 
    	{
    	  return false;
    	}
    	var x = this.WIDTH - (this.WIDTH - this.eyeline_width)/2;
    	var y = this.eyeline_height;
    	var line_name;
    	for(var i = 0; i < this.right_eye.length; i++){					// Otherwise, working on a line.
    		if(!this.finished.includes(this.right_eye[i].name)){
    			x += this.eye_width*this.right_eye[i].x();
    			y += this.eye_height*this.right_eye[i].y();
    			line_name = this.right_eye[i].name;
    			break;
    		}
    	}
    	this.drawLine(x, y, 2, line_name);
    	return true;
	}

	changeCanvas(){
		this.WIDTH = window.innerWidth;
		this.HEIGHT = window.innerHeight;

		this.eyeline_width = getRandomFloat(this.WIDTH*.3, this.WIDTH*.5);
		this.eyeline_height = getRandomFloat(this.HEIGHT*.3, this.HEIGHT*.4);

		this.eye_width = this.eyeline_width/(getRandomInt(2,6));
		var multiplier = 1/(getRandomInt(2,6));
		multiplier = Math.abs(2 - multiplier);
		this.eye_height = this.eye_width / multiplier;

		var x = this.WIDTH - this.eyeline_width;
		x = x/2;
		this.pencil_x = x;
		this.pencil_y = this.eyeline_height;
	}
}
class Eraser{
	constructor(){
		this.OPACITY_MAX = 1;
		this.WIDTH = window.innerWidth;
		this.HEIGHT = window.innerHeight;
		this.stroke_width = 30;
    	this.erase_width = getRandomFloat(this.WIDTH*.5, this.WIDTH*.8);
    	this.erase_height = getRandomFloat(this.HEIGHT*.1, this.HEIGHT*.5);
    	this.erase_count = 0;
    	this.eraser_x = (this.WIDTH - this.erase_width)/2;
    	this.eraser_y = (this.HEIGHT - this.erase_height)/2 - 105;
    	this.working = false;
    	this.opacity = this.OPACITY_MAX;
	}

	eraseAll(count){
		if(this.erase_count == count) {
      		this.erase_width = getRandomFloat(this.WIDTH*.5, this.WIDTH*.8);
      		this.erase_height = getRandomFloat(this.HEIGHT*.1, this.HEIGHT*.5);
      		this.erase_count = 0;
      		this.eraser_x = (this.WIDTH - this.erase_width)/2;
      		this.eraser_y = (this.HEIGHT - this.erase_height)/2;
      		this.opacity = this.OPACITY_MAX;
      		return false;
    	}
    	var erase_percentage = this.erase_count/count;
    	if(erase_percentage >= .5){
      		this.opacity = this.OPACITY_MAX - this.OPACITY_MAX*erase_percentage;
    	} else {
      		this.opacity = this.OPACITY_MAX*erase_percentage;
    	}
    	var x;
    	var y = (this.HEIGHT - this.erase_height)/2 + this.erase_height*erase_percentage - 105;
    	if(this.erase_count%2 == 0)	{
      		x = this.WIDTH - (this.WIDTH - this.erase_width)/2;
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
			artist.changeCanvas();
			eraser.changeCanvas();
			resized = false;
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