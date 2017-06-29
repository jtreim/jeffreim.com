var stage;
var renderer;
var fieldTexture;
var field;
var rendererOptions;
var Container;
var autoDetectRenderer;
var loader;
var resources;
var Sprite;

function startDrawEyes(){
  Container = PIXI.Container;
  autoDetectRenderer = PIXI.autoDetectRenderer;
  loader = PIXI.loader;
  resources = PIXI.loader.resources;
  Sprite = PIXI.Sprite;

  stage = new Container();

  rendererOptions = {
    view: document.getElementById("gameCanvas"),
    resolution: 1
  };

  renderer = autoDetectRenderer(
    window.innerWidth,
    window.innerHeight,
    rendererOptions
  );
  
  window.addEventListener("resize", function(event){ onResize(); });  

  console.log("Successfully started Draw Eyes.");
}

function setup(){
  renderer.render(stage);
}

function endDrawEyes(){
  console.log("Ended Draw Eyes.");
}