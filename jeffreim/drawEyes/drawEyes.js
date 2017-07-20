var graphics = new PIXI.Graphics();
const HEIGHT = 1200;
const WIDTH = 1200;

function getRandomFloat(min, max){
	return Math.random() * (max-min) + min;
}
function getRandomInt(min, max){
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max-min+1)) + min;
}
class Artist{
	constructor(){
		this.stroke_width =  1;
		this.fill = 0x000000;
		
		this.working = false;
		this.working_on = "draw: ";
		this.finished = "finished:";
		
		this.eyeline_height = getRandomFloat(HEIGHT*.37, HEIGHT*.42);
		this.eyeline_width = getRandomFloat(WIDTH*.4, WIDTH*.2);

		this.eye_width = this.eyeline_width/(getRandomInt(2,6));
		var multiplier = 1/(getRandomInt(1,4));
		multiplier = Math.abs(2 - multiplier);
		this.eye_height = this.eye_width / multiplier;

		var x = WIDTH - this.eyeline_width;
		x = x/2;
		this.pencil_x = x;
		this.pencil_y = this.eyeline_height;
	}

	drawLine(x_end, y_end, max_stroke, line_name){
		var x_dist = x_end - this.pencil_x;
		var y_dist = y_end - this.pencil_y;
		var difference = Math.pow(x_dist,2) + Math.pow(y_dist,2);
		difference = Math.sqrt(difference);
		if(!this.working_on.includes(line_name)){
			this.working_on += line_name;
			this.stroke_width = 1;
		}else if(difference <= 1){
			var line_name_start = this.working_on.indexOf(line_name);
			this.working_on = this.working_on.substring(0, line_name_start);
			this.finished += line_name;
		}else{
			if(this.stroke_width < max_stroke && difference > (Math.pow(max_stroke,2)/2.5)){
				this.stroke_width += 1;
			}
			var slope_fraction = difference / this.stroke_width * 2;
			this.pencil_x += x_dist/slope_fraction;
			this.pencil_y += y_dist/slope_fraction;
		}
	}

	drawEyes(){
		if(!this.working_on.includes("right eye") && this.finished.includes("and right eye")){
			this.stroke_width = 1;
			this.fill = 0x000000;
		
			this.working = false;
			this.finished = "finished:";
		
			this.eyeline_height = getRandomFloat(HEIGHT*.1, HEIGHT*.42);
			this.eyeline_width = getRandomFloat(WIDTH*.3, WIDTH*.7);

			this.eye_width = this.eyeline_width/(getRandomInt(2,6));
			var multiplier = 1/(getRandomInt(1,4));
			multiplier = Math.abs(2 - multiplier);
			this.eye_height = this.eye_width / multiplier;

			var x = WIDTH - this.eyeline_width;
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
						this.eyeline_height += HEIGHT*getRandomFloat(-.01,.03);
						break;
					case 2:
						this.eyeline_height += WIDTH*getRandomFloat(-.03,.03);
						break;
					case 3:
						this.eyeline_height += HEIGHT*getRandomFloat(-.01,.03);
						this.eyeline_width += WIDTH*getRandomFloat(-.04,.04);
						break;
					default:
						break;
				}
				this.eye_width = this.eyeline_width/(getRandomInt(2,6));
				var size_multiplier = 1/getRandomFloat(1,4);
				size_multiplier = Math.abs(2-size_multiplier);
				this.eye_height = this.eye_width/size_multiplier;
				this.pencil_x = WIDTH - (WIDTH - this.eyeline_width)/2;
				this.pencil_y = this.eyeline_height;
			}
		}else if(!this.working_on.includes("left eye") && !this.finished.includes("left eye")){
			var x = WIDTH - this.eyeline_width;
			x = x/2;
			this.working_on += "left eye";
			this.drawLeftEye();
		}
		return true;
	}

	drawLeftEye(){
		if(!this.working_on.includes("lower lid left") && this.finished.includes("lower lid left")) // Finished drawing the left eye.
    	{
    	  return false;
    	}
    	var x = (WIDTH - this.eyeline_width)/2;
    	var y = this.eyeline_height;
    	var line_name;
    	if(!this.finished.includes("top lid left"))   // Starting the left eye.
    	{
    		x += this.eye_width * .25;
    		y -= this.eye_height * .3;
    		line_name = " top lid left";
    	}
    	else if(!this.finished.includes("top lid center"))
    	{
    		x += this.eye_width * .75;
    		y -= this.eye_height/2;
      		line_name = " top lid center";
    	}
    	else if(!this.finished.includes("top lid right"))
    	{
    		x += this.eye_width * .9;
    		y -= this.eye_height * .1;
      		line_name = " top lid right";
	    }
    	else if(!this.finished.includes("top lid tear duct"))
    	{
    		x += this.eye_width;
    		line_name = " top lid tear duct";
    	}
    	else if(!this.finished.includes("side tear duct"))
    	{
    		x += this.eye_width*.95;
    		y += this.eye_height*.1;
      		line_name =" side tear duct";
	    }
    	else if(!this.finished.includes("lower lid tear duct"))
    	{
    		x += this.eye_width * .9;
    		y += this.eye_height * .05;
      		line_name = " lower lid tear duct";
    	}
    	else if(!this.finished.includes("lower lid right"))
    	{
    		x += this.eye_width * .85;
      		y += this.eye_height * .1;
      		line_name = " lower lid right";
	    }
	    else if(!this.finished.includes("lower lid center"))
	    {
    		x += this.eye_width * .3;
    		y += this.eye_height * .3;
      		line_name = " lower lid center";
	    }
    	else if(!this.finished.includes("lower lid left"))
    	{
    		line_name = " lower lid left";
	    }
    	this.drawLine(x, y, 2, line_name);
    	return true;
	}

	drawRightEye(){
		if(!this.working_on.includes("lower lid right") && this.finished.includes("lower lid right")){
			return false;
		}
		var x = WIDTH - (WIDTH - this.eyeline_width)/2;
		var y = this.eyeline_height;
		var line_name;
		if(!this.finished.includes("top lid right")){
			x -= this.eye_width*.25;
			y -= this.eye_height*.3;
			line_name = " top lid right";
		}
		else if(!this.finished.includes("top lid center"))
    	{
     		x -= this.eye_width * .75;
      		y -= this.eye_height/2;
      		line_name = " top lid center";
    	}
    	else if(!this.working_on.includes("top lid left") && !this.finished.includes("top lid left"))
    	{
      		x -= this.eye_width * .9;
      		y -= this.eye_height * .1;
      		line_name = " top lid left";
    	}
    	else if(!this.finished.includes("top lid tear duct"))
    	{
      		x -= this.eye_width;
      		line_name = " top lid tear duct";
    	}
    	else if(!this.finished.includes("side tear duct"))
    	{
    		x -= this.eye_width*.95;
      		y += this.eye_height*.1;
      		line_name = " side tear duct";
    	}
    	else if(!this.finished.includes("lower lid tear duct"))
    	{
      		x -= this.eye_width * .9;
      		y += this.eye_height * .05;
      		line_name = " lower lid tear duct ";
    	}
    	else if(!this.finished.includes("lower lid left"))
    	{
      		x -= this.eye_width * .85;
      		y += this.eye_height * .1;
      		line_name = " lower lid left";
    	}
    	else if(!this.finished.includes("lower lid center"))
    	{
      		x -= this.eye_width * .3;
      		y += this.eye_height * .3;
      		line_name = " lower lid center";
    	}
    	else if(!this.finished.includes("lower lid right"))
    	{
      		line_name = " lower lid right";
    	}
    	this.drawLine(x, y, 2, line_name);
    	return true;
	}

	resetArtist(){

	}
}

var artist = new Artist();
var DEstage = new PIXI.DisplayObjectContainer();
DEstage.backgroundColor = 0xFF0000;

function DEsetup(){
	DEstage.width = 1200;
	DEstage.height = 1200;
	DEstage.addChild(graphics);
	DEstage.visible = false;
}

function DEanimate(){
	if(!artist.working){
		artist.working = true;
		artist.drawEyes();
	}else if(artist.working && !artist.drawEyes()){
		artist.working = false;
	}
	if(artist.working){
		graphics.beginFill(artist.fill);
		graphics.drawEllipse(artist.pencil_x, artist.pencil_y, artist.stroke_width, artist.stroke_width)
		graphics.endFill();
	}
}

