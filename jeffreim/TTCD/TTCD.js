var TTCDstage = new PIXI.DisplayObjectContainer();

function TTCDsetup(){
	var bg = new PIXI.Sprite(
			PIXI.loader.resources["../img/LM.jpg"].texture
		);
	TTCDstage.addChild(bg);

	TTCDstage.visible = false;
}
