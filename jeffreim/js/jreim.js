var canvas;
var rendererOptions;

var fieldTexture;
var field;

var autoDetectRenderer;
var renderer;
var stage;


var loader;
var resources;
var Sprite;

$(document).ready(function(){
	$("#gamesList li").click(function(event){
		var target = $(event.target);
		if(!(target.is($(".selection")))){
			canvas = document.getElementById("gameCanvas");
			$(".selection").toggleClass("selection");
			target.toggleClass("selection");
			console.log("Switched to \"" + target.text() + "\".");
		}
	});
});

function setup(){
	canvas = document.getElementById("gameCanvas");
	rendererOptions = { view: canvas, antialias: false, transparent: false, resolution:1 };
	autoDetectRenderer = PIXI.autoDetectRenderer;
	renderer = autoDetectRenderer(canvas.width, canvas.height, rendererOptions);
	renderer.backgroundColor = 0xFFFFFF;
	stage = new PIXI.Container();
	display();	
}

function display(){
	renderer.render(stage);
}


function fadeOut(el){
  el.style.opacity = 1;

  (function fade() {
    if ((el.style.opacity -= .1) < 0) {
      el.style.display = "none";
    } else {
      requestAnimationFrame(fade);
    }
  })();
}

function fadeIn(el, display){
  el.style.opacity = 0;
  el.style.display = display || "block";

  (function fade() {
    var val = parseFloat(el.style.opacity);
    if (!((val += .1) > 1)) {
      el.style.opacity = val;
      requestAnimationFrame(fade);
    }
  })();
}