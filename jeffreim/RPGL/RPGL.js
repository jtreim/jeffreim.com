var RPGLstage = new PIXI.DisplayObjectContainer();

function RPGLsetup(){
	var field = new PIXI.Sprite(
			PIXI.loader.resources["../img/field.png"].texture
		);
	RPGLstage.addChild(field);

	RPGLstage.visible = false;
}
