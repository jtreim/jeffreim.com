function getRandomInt(min, max){
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max-min+1)) + min;
}
function getRandomFloat(min, max){
	return Math.random() * (max-min) + min;
}
function getAngle(x, y, _x, _y){
	var dy = _y - y;
	var dx = _x - x;
	return Math.atan2(dy, dx);
}
function getDist(x, y, _x, _y){
	var dx = _x - x;
	var dy = _y - y;
	return Math.sqrt((Math.pow(dx,2) + Math.pow(dy,2)));
}

var stage = new PIXI.Container();
var graphics = new PIXI.Graphics();
var container = new PIXI.DisplayObjectContainer();
var loader = PIXI.loader;
var resources = loader.resources;

const SKY_CLR = 0xA5D5F9;

const BASE_GRASS_CLR = 0x0BC101;
const GRASS_CLR = 0x33E12A;
const LIGHT_GRASS_CLR = 0x61F05A;
const DARK_GRASS_CLR = 0x055701;

const BFLY_WINGS_CLR = 0xE6FA5C;
const BFLY_BODY_CLR = 0x7D9000;

const WAIT_INTERVAL = 5000;
const BFLY_INTERVAL = 10000;
var bflyTimeout;

const MAX_SPD = 20;
const BFLY_SPD = -5;

var GRASS_W = 16; 
var GRASS_H = 64;
var BFLY_SCALE = 5;

var stick;
var input;

var grass;
var butterfly;

$(document).ready(function(){
	window.addEventListener("resize", function(event){
		resize();
		renderer.view.autoResize = true;
		renderer.resize(window.innerWidth, window.innerHeight);
	});
	loader
	.add("../../img/butterfly.json")
	.add('grassbgd',"../../img/grassbgd.png")
	.add('grass1','../../img/grass1.png')
	.add('grass2', '../../img/grass2.png')
	.load(setup);
});

function setup(){
	canvas = document.getElementById("gameCanvas");
	rendererOptions = { view: canvas, antialias: false, transparent: false, resolution:1 };
	autoDetectRenderer = PIXI.autoDetectRenderer;
	renderer = autoDetectRenderer(window.innerWidth, window.innerHeight, rendererOptions);
	renderer.backgroundColor = SKY_CLR;

	if(window.innerWidth < 700){
		grass = new Grass(0, renderer.height*2/3, renderer.width, renderer.height/3, 400);
		butterfly = new Butterfly();
		stick = new ControlStick(window.innerWidth/2, window.innerHeight*3/4, 20, 30, graphics);
	}else{
		grass = new Grass(0, renderer.height*2/3, renderer.width, renderer.height/3, 1000);
		butterfly = new Butterfly();
		stick = new ControlStick(window.innerWidth/2, window.innerHeight*3/4, 30, 40, graphics);
	}
	graphics.interactive = true;
	
	graphics
		.on('mousedown', onDragStart)
		.on('touchstart', onDragStart)
		.on('mouseup', onDragEnd)
		.on('mouseupoutside', onDragEnd)
		.on('touchend', onDragEnd)
		.on('touchendoutside', onDragEnd)
		.on('mousemove', onDragMove)
		.on('touchmove', onDragMove);

	stage.addChild(graphics);
	animate();
}

function animate(){
	renderer.render(stage);
	butterfly.move();
	if(stick.moving){
		grass.moveView(input);
		butterfly.moveView(input);
	}
	stick.draw();
	if(!butterfly.onscreen() && !bflyTimeout){
		bflyTimeout = setTimeout(resetBfly, BFLY_INTERVAL);
	}
	requestAnimationFrame(animate);
}

function resize(){
	var ratio = {
		x: window.innerWidth/renderer.width,
		y: window.innerHeight/renderer.height
	}
	GRASS_W *= (ratio.x * ratio.y);
	GRASS_H *= (ratio.x * ratio.y);
	grass.resize(ratio);
	butterfly.resize(ratio);
	stick.resize(ratio);
}

class GrassBlade{
	constructor(x, y, w, h){
		this.pos = {
			x: x,
			y: y
		};
		this.size = {
			w: w,
			h: h
		};

		var c = getRandomInt(1,3);
		var texture;
		switch(c){
			case 1: 
				texture = resources.grass1.texture;
				break;
			default: 
				texture = resources.grass2.texture;
		}
		this.sprite = new PIXI.Sprite(texture);
		this.sprite.scale.x = this.size.w;
		this.sprite.scale.y = this.size.h;
		this.sprite.x = this.pos.x;
		this.sprite.y = this.pos.y;
	}
}

class Grass{
	constructor(x, y, w, h, amount){
		this.grassBlades = [];
		this.container = new PIXI.DisplayObjectContainer();
		this.pos = {
			x: x,
			y: y,
			_x: (x+w),
			_y: (y+h)
		};
		this.size = {
			w: w,
			h: h
		};

		var texture = resources.grassbgd.texture;

		this.sprite = new PIXI.Sprite(texture);
		this.sprite.width = this.size.w;
		this.sprite.height = this.size.h;
		this.sprite.x = this.pos.x;
		this.sprite.y = this.pos.y;

		stage.addChild(this.sprite);
		stage.addChild(this.container);
		this.newGrass(amount);
	}
	newGrass(amount){
		for(var i = 0; i < amount; i++){
			var x = getRandomInt(this.pos.x, this.pos._x - GRASS_W);
			var y = getRandomInt(this.pos.y, this.pos._y);

			var ratio = (y - this.pos.y)/this.size.h;

			var w = GRASS_W * ratio;
			var h = GRASS_H * ratio;
			this.grassBlades.push(new GrassBlade(x,y,w,h));

			var last = this.grassBlades[this.grassBlades.length - 1];
			this.container.addChild(last.sprite)
		}
		this.grassBlades.sort(function(a, b){ return a.pos.y - b.pos.y });
		this.container.children.sort(function(a, b){
			return a.y - b.y;
		})
	}
	moveView(input){
		for(var i = 0; i < this.grassBlades.length; i++){
			var g = this.grassBlades[i];

			var scale = (g.pos.y - this.pos.y)/this.size.h; 
			
			g.pos.x += input.x * scale;
			g.pos.y += input.y * scale;
			
			if(g.pos.x < this.pos.x){
				g.pos.x = this.pos._x;
				g.pos.y = getRandomInt(0, this.size.h) + this.pos.y;
			}else if(g.pos.x > this.pos._x){
				g.pos.x = this.pos.x;
				g.pos.y = getRandomInt(0, this.size.h) + this.pos.y;
			}

			if(g.pos.y > this.pos._y){
				g.pos.y = this.pos.y + getRandomInt(0, this.size.h/2);
				g.pos.x = getRandomInt(this.pos.x, this.pos._x);
			}else if(g.pos.y < this.pos.y - g.size.h + 4){
				g.pos.y = this.pos._y - getRandomInt(0,this.size.h/2);
				g.pos.x = getRandomInt(this.pos.x, this.pos._x);
			}

			scale = (g.pos.y - this.pos.y)/this.size.h;
			g.size.w = GRASS_W * scale;
			g.size.h = GRASS_H * scale;

			g.sprite.scale.x = g.size.w;
			g.sprite.scale.y = g.size.h;
			g.sprite.x = g.pos.x;
			g.sprite.y = g.pos.y;
		}
		this.container.children.sort(function (a,b){
			return a.y - b.y;
		});
	}
	resize(ratio){
		this.pos.x *= ratio.x;
		this.pos._x *= ratio.x;
		this.pos.y *= ratio.y;
		this.pos._y *= ratio.y;
		this.size.w *= ratio.x;
		this.size.h *= ratio.y;

		for(var i = 0; i < this.grassBlades.length; i++){
			var g = this.grassBlades[i];
			g.pos.x *= ratio.x;
			g.pos.y *= ratio.y;
			if(g.pos.x < this.pos.x){
				g.pos.x = this.pos._x;
				g.pos.y = getRandomInt(0, this.size.h) + this.pos.y;
			}else if(g.pos.x > this.pos._x){
				g.pos.x = this.pos.x;
				g.pos.y = getRandomInt(0, this.size.height) + this.pos.y;
			}

			if(g.pos.y > this.pos._y){
				g.pos.y = this.pos.y + getRandomInt(0, this.size.height/2);
				g.pos.x = getRandomInt(this.pos.x, this.pos._x);
			}else if(g.pos.y < this.pos.y - g.size.h + 4){
				g.pos.y = this.pos._y - getRandomInt(0,this.size.height/2);
				g.pos.x = getRandomInt(this.pos.x, this.pos._x);
			}

			var scale = (g.pos.y - this.pos.y)/this.size.h;
			g.size.w = GRASS_W * scale;
			g.size.h = GRASS_H * scale;

			g.sprite.scale.x = g.size.w;
			g.sprite.scale.y = g.size.h;
			g.sprite.x = g.pos.x;
			g.sprite.y = g.pos.y;
		}
		this.sprite.x = this.pos.x;
		this.sprite.y = this.pos.y;
		this.sprite.scale.x = this.size.w;
		this.sprite.scale.y = this.size.h;
		this.container.children.sort(function(a,b){ return a.y - b.y });
	}
}

class Butterfly{
	constructor(){
		this.MIN_Y = renderer.height*13/20;
		this.MAX_Y = renderer.height;

		this.spd = BFLY_SPD;

		var frames = [];
		frames.push(PIXI.Texture.fromFrame("butterfly.png"));
		frames.push(PIXI.Texture.fromFrame("butterfly2.png"));
		this.sprite = new PIXI.extras.AnimatedSprite(frames);
		
		this.scale = this.sprite.scale;
		this.resetView();

		this.sprite.animationSpeed = .15;
		this.sprite.play();

		stage.addChild(this.sprite); 
	}
	moveView(input){
		var scale = (this.sprite.y - this.MIN_Y)/(this.MAX_Y - this.MIN_Y);

		this.sprite.x += input.x * scale;
		this.sprite.y += input.y * scale;

		scale = (this.sprite.y - this.MIN_Y)/(this.MAX_Y - this.MIN_Y);
		scale *= BFLY_SCALE;
		this.scale.x = scale;
		this.scale.y = scale;
	}
	move(){
		var scale = (this.sprite.y - this.MIN_Y)/(this.MAX_Y - this.MIN_Y);
		this.sprite.x += this.spd * scale;
		this.sprite.y += getRandomInt(-5,5) * scale;
		
		scale = (this.sprite.y - this.MIN_Y)/(this.MAX_Y - this.MIN_Y);
		scale *= BFLY_SCALE;
		this.scale.x = scale;
		this.scale.y = scale;
	}
	resize(ratio){
		this.sprite.x *= ratio.x;
		this.sprite.y *= ratio.y;
		this.scale.x *= ratio.x;
		this.scale.y *= ratio.y;

		this.MIN_Y *= ratio.y;
		this.MAX_Y *= ratio.y;
	}
	resetView(){
		this.sprite.x = renderer.width + this.scale.x;
		this.sprite.y = getRandomFloat(this.MIN_Y, this.MAX_Y);
		var scale = (this.sprite.y - this.MIN_Y)/(this.MAX_Y - this.MIN_Y);
		scale *= BFLY_SCALE;
		this.scale.x = scale;
		this.scale.y = scale;
	}
	onscreen(){
		return (this.sprite.x >= 0 - this.scale.x &&
				this.sprite.x <= renderer.width + this.scale.x &&
				this.scale.x != 0);
	}
}

class Cloud{
	constructor(x, y, w, h, spd){
		this.pos = {
			x: x,
			y: y,
			_x: (x+w),
			_y: (y+h)
		};
		this.size = {
			w: w,
			h: h
		};

		this.spd = spd;
	}
	moveView(input){
		this.pos.x += input.x;
	}
	move(){
		this.pos.x += this.spd;
	}
	resize(ratio){
		this.pos.x *= ratio.x;
		this.pos._x *= ratio.x;
		this.pos.y *= ratio.y;
		this.pos._y *= ratio.y;
		this.size.w *= ratio.x;
		this.size.h *= ratio.y;

		this.sprite.x = this.pos.x;
		this.sprite.y = this.pos.y;
		this.sprite.scale.x = this.size.w;
		this.sprite.scale.y = this.size.h;

	}
}

class Flower{
	constructor(x, y, w, h){
		this.pos = {
			x: x,
			y: y,
			_x: (x+w),
			_y: (y+h)
		};
		this.size = {
			w: w,
			h: h
		};

		this.growing = true;
	}
	moveView(input){
		var scale = (this.pos.y - grass.pos.y)/grass.size.h;

		this.pos.x += input.x * scale;
		this.pos.y -= input.y * scale;

		scale = (this.pos.y - grass.pos.y)/grass.size.h;
	}
	// TODO: grow(){
	// 	if(Long enough between frames)
	// 		{ change frames }
	// 	if(Starting new frame)
	// 		{ change x & y pos }
	// }
	startNew(){
		this.pos.x = getRandomInt(grass.pos.x, grass.pos._x);
		this.pos.y = getRandomInt(grass.pos.y, grass.pos._y);

		var scale = (this.pos.y - grass.pos.y)/grass.size.h;
		this.size.w = FLWR_W * scale;
		this.size.h = FLWR_H * scale;
	}
	resize(ratio){
		this.pos.x *= ratio.x;
		this.pos._x *= ratio.x;
		this.pos.y *= ratio.y;
		this.pos._y *= ratio.y;
		this.size.w *= ratio.x;
		this.size.h *= ratio.y;
	}
}

class ControlStick{
	constructor(x, y, radius, max){
		this.pos = {
			x: x, 
			y: y,
			
			center:{
				x: x,
				y: y
			}
		};
		this.radius = radius;
		this.max = max;

		this.moving = false;
		this.data = null;
		graphics.hitArea = new PIXI.Circle(this.pos.x, this.pos.y, this.max);
	}
	draw(){
		graphics.clear();
		graphics.beginFill(0xBBBBBB, 0.5);
		graphics.drawCircle(this.pos.center.x, this.pos.center.y, this.max);
		graphics.endFill();
		graphics.lineStyle(2, 0xFFFFFF, 1);
		graphics.drawCircle(this.pos.x, this.pos.y, this.radius);
		graphics.lineStyle(0);
	}
	reset(){
		this.pos.x = this.pos.center.x;
		this.pos.y = this.pos.center.y;
		this.moving = false;
	}
	moveTo(x, y){
		if(this.moving){
			var angle = this.getAngle(x, y);
			var dist = this.getDist(x, y);
			if(dist > this.max){
				this.pos.x = this.pos.center.x + Math.cos(angle) * this.max;
				this.pos.y = this.pos.center.y + Math.sin(angle) * this.max;
			}else{
				this.pos.x = x;
				this.pos.y = y;
			}
		}
	}
	getInput(){
		var x = -1*(stick.pos.x - stick.pos.center.x)/stick.max * MAX_SPD;
		var y = -1*(stick.pos.y - stick.pos.center.y)/stick.max * MAX_SPD;
		return {x: x, y: y};
	}
	resize(ratio){
		this.pos.x *= ratio.x;
		this.pos.center.x *= ratio.x;
		this.pos.center.y *= ratio.y;
		this.pos.y *= ratio.y;
		this.max *= (ratio.x * ratio.y);
		this.radius *= (ratio.x * ratio.y);

		graphics.hitArea = new PIXI.Circle(this.pos.x, this.pos.y, this.max);
	}
	getAngle(x, y){
		var dx = x - this.pos.center.x;
		var dy = y - this.pos.center.y;
		return Math.atan2(dy, dx);
	}
	getDist(x, y){
		var dx = x - this.pos.center.x;
		var dy = y - this.pos.center.y;
		return Math.sqrt((Math.pow(dx,2) + Math.pow(dy,2)));
	}
}

function onDragStart(event){
	stick.data = event.data;
	input = stick.getInput();
	stick.moving = true;
	clearTimings();
	interval = null;
}
function onDragEnd(){
	stick.reset();
	stick.data = null;
	startTimings();
}
function onDragMove(){
	if(stick.moving){
		var point = stick.data.getLocalPosition(this.parent);
		stick.moveTo(point.x, point.y);
		input = stick.getInput();
	}
}

function startTimings(){
	if(!butterfly.onscreen() && !bflyTimeout){
		bflyTimeout = setTimeout(resetBfly, BFLY_INTERVAL);
	}
}
function clearTimings(){
	if(bflyTimeout){
		clearTimeout(bflyTimeout);
		bflyTimeout = null;
	}
}

function resetBfly(){
	butterfly.resetView();
}