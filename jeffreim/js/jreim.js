var canvas;
var rendererOptions;

var fieldTexture;
var field;

var autoDetectRenderer;
var renderer;
var stage = new PIXI.Container();


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

			for(var i = 0; i < stage.children.length; i++){
				stage.children[i].visible = false;
			}

			if(target.text() == "RPG Life"){
				RPGLstage.visible = true;
			}
			else if(target.text() == "Trying to Change Dreams"){
				TTCDstage.visible = true;
			}
			else if(target.text() == "Drawing Eyes"){
				DEstage.visible = true;
			}
		}
	});
	window.addEventListener("resize", function(event){
		renderer.view.autoResize = true;
		renderer.resize(window.innerWidth, window.innerHeight);
	})
	loadGames();
	display();
});

function loadGames(){
	canvas = document.getElementById("gameCanvas");
	rendererOptions = { view: canvas, antialias: false, transparent: false, resolution:1 };
	autoDetectRenderer = PIXI.autoDetectRenderer;
	renderer = autoDetectRenderer(window.innerWidth, window.innerHeight, rendererOptions);
	renderer.backgroundColor = 0xFFFFFF;

	PIXI.loader
	.add("../img/field.png")
	.add("../img/LM.jpg")
	.add("../img/KMS.jpg")
	.load(setup);	
}

function setup(){
	RPGLsetup();
	TTCDsetup();
	DEsetup();

	
	stage.addChild(RPGLstage);
	stage.addChild(TTCDstage);
	stage.addChild(DEstage);
	DEstage.visible = true;
	display();
}
function display(){	
	renderer.render(stage);
	if(typeof DEstage !== 'undefined' && DEstage.visible){
		DEanimate();
		DEanimate();
		DEanimate();
	}
	requestAnimationFrame(display);
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