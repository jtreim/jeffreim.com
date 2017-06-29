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

function setup(){
  canvas = document.getElementById("gameCanvas");
  rendererOptions = { view: canvas, antialias: false, transparent: false, resolution:1 };
  autoDetectRenderer = PIXI.autoDetectRenderer;
  renderer = autoDetectRenderer(canvas.width, canvas.height, rendererOptions);
  stage = new PIXI.Container();
  display();
}

function display(){
  renderer.render(stage);
}