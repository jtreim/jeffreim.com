// Starting a server: http-server -c-1

// function onResizeRPGL(){
// 	renderer.autoResize = true;
// 	renderer.resize(window.innerWidth, window.innerHeight);
// 	field.height = window.innerHeight;
// 	field.width = window.innerWidth;;
// 	renderer.render(stage);
// }

function setup(){
  field = new Sprite(resources["background"].texture);
  field.height = renderer.view.height;
  field.width = renderer.view.width;
  stage.addChild(field);
  renderer.render(stage);
}

function endRPGL(){
  loader.reset();
  for(var i = 0; i < stage.children.length; i++){
    stage.removeChild(stage.children[1]);
  };
  console.log("Ended RPGL.");
}