var BrokenModule = (function(){
	paper.install(window);
	var init = function(){
		var c = document.querySelector("#game-canvas");
		paper.setup(c);
		project._children[0] = new Layer();
		paths = project._children[0]._children;
		var _ratio = {
			w: window.innerWidth,
			h: window.innerHeight
		};
		view.onFrame = function(event){
			if(_animate){
				_move();
			}
		}
	}
	const _HITOPTIONS = {
		segments: true,
		stroke: true,
		fill: true,
		tolerance: 5
	};

	var _animate = true;
	const _COLOR = "#222222";
	const _STROKE = 3;
	var _path;
	var paths =[];
	var _blobItr = 0;
	var _emptyClick = false;

	var go = null;

	const FEARS = ["Aquaphobia", "Aeroacrophobia", "Dendrophobia", "Gephyrophobia", 
	"Kenophobia", "Metrophobia", "Phronemophobia", "Phobophobia", "Symmetrophobia", "Thaasophobia"];
	const COLORS = ["Teal", "Navy blue", "Maroon", "Yellow orange", "Dark red", "Sunshine yellow", "Evergreen", 
	"Purple", "Light pink", "Jet Black", "White", "Grey", "Beige"];
	const EMOTIONS = ["Ecstatic", "Lonely", "Petrified", "Bored", "Frustrated", "Depressed", "Ambivalent", "Cheerful",
	"Anxious", "Nervous", "Upbeat"];

	var _tool = new Tool();
	var _getRandomFloat = function(min, max){
		return Math.random() * (max-min) + min;
	}
	var _getRandomInt = function(min, max){
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max-min+1)) + min;
	}

	var _getRandomFacts = function(){
		switch(_getRandomInt(0, 5)){
			case 0:
				return {
					color: COLORS[(_getRandomInt(0, COLORS.length - 1))],
					emotion: EMOTIONS[(_getRandomInt(0, EMOTIONS.length - 1))],
					jump: _getRandomInt(0, 5) + "ft " + _getRandomInt(0, 11) + "in"
				}
			case 1:
				return {
					fear: FEARS[(_getRandomInt(0, FEARS.length - 1))],
					emotion: EMOTIONS[(_getRandomInt(0, EMOTIONS.length - 1))],
					fat: _getRandomInt(5, 90)
				}
			case 2:
				return {
					jump: _getRandomInt(0, 5) + "ft " + _getRandomInt(0, 11) + "in",
					iq: _getRandomInt(40, 160),
					color: COLORS[(_getRandomInt(0, COLORS.length - 1))]
				}
			case 3:
				return {
					jump: _getRandomInt(0, 5) + "ft " + _getRandomInt(0, 11) + "in",
					fat: _getRandomInt(5, 90),
					color: COLORS[(_getRandomInt(0, COLORS.length - 1))]
				}
			case 4:
				return {
					fear: FEARS[(_getRandomInt(0, FEARS.length - 1))],
					iq: _getRandomInt(40, 160),
					fat: _getRandomInt(5, 90)
				}
			case 5:
				return {
					emotion: EMOTIONS[(_getRandomInt(0, EMOTIONS.length - 1))],
					fear: FEARS[(_getRandomInt(0, FEARS.length - 1))],
					iq: _getRandomInt(40, 160)
				}
			default:
				return {
					color: COLORS[(_getRandomInt(0, COLORS.length - 1))],
					emotion: EMOTIONS[(_getRandomInt(0, EMOTIONS.length - 1))],
					iq: _getRandomInt(40, 160)
				}
		}
	}

	var _move = function(){
		for(var i = 0; i < paths.length; i++){
			var p = paths[i];
			for(var s = 0; s < p.segments.length; s++){
				var point = p.segments[s].point;
				point.x += _getRandomFloat(-.8,.8);
				point.y += _getRandomFloat(-.8,.8);
			}
		}
	}

	class _Blob{
		constructor(){
			this.id = _blobItr;
			_blobItr++;
			this.facts = _getRandomFacts(); 
		}
	}

	_tool.onMouseDown = function(event){
		var hitResult = project.hitTest(event.point, _HITOPTIONS);
		if(hitResult && go && state != 'view'){
			blob = hitResult.item.blob;
			state = 'view';
			go(blob);
		}else if(hitResult && state == 'view'){
			_emptyClick = true;
		}else{
			var point = event.point;
			_path = new Path({
				segments: [point],
				strokeColor: _COLOR,
				strokeWidth: _STROKE
			});
			_animate = false;
		}
	}
	_tool.onMouseDrag = function(event){
		var point = event.point;
		_path.add(point);
	}

	_tool.onMouseUp = function(event){
		if(!_emptyClick){
			var point = event.point;
			_path.add(point);
			_path.closed = true;
			_path.fillColor = _COLOR;
			_path.smooth();
			_path.simplify(8);
			_path.blob = new _Blob();
			_animate = true;
		}else{
			_emptyClick = !_emptyClick;
		}
	}

	_tool.onMouseMove = function(event){
		var hitResult = project.hitTest(event.point, _HITOPTIONS);
		if(hitResult && state != 'view'){
			document.body.style.cursor = "pointer";
		}else if(!hitResult){
			document.body.style.cursor = "default";
		}
	}

	var setGo = function(f){
		go = f;
	}
	var resize = function(){}

	return{
		init: init,
		setGo: setGo,
		go: go
	}
})(); 