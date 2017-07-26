var RPGLstage = new PIXI.DisplayObjectContainer();

function RPGLsetup(){
	var field = new PIXI.Sprite(
			PIXI.loader.resources["../img/field.png"].texture
		);
	
	RPGLstage.scale.x = 1;
	RPGLstage.scale.y = 1;
	RPGLstage.addChild(field);
	RPGLstage.visible = false;
}

function RPGLanimate(){}
function RPGLresize(){}
