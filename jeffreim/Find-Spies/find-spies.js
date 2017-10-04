var FindSpy = (function(){
	class Person{
		constructor(data){
			this.name = {
				first: data['name']['first'],
				last: data['name']['last'],
				title: data['name']['title']
			};
			this.login = {
				md5: data['login']['md5'],
				username: data['login']['username'],
				password: data['login']['password'],
				email: data['email'],
				known: false
			};
			this.location = {
				city: data['location']['city'],
				zip: data['location']['postcode'],
				street: data['location']['street'],
				known: false
			};
			this.gender = data['gender'];
			this.phone = {
				home: data['phone'],
				cell: data['cell'],
				known: false
			};
			this.dob = {
				dob: data['dob'],
				known: false
			};
			this.nat = {
				nat: data['nat'],
				known: false
			};
			this.spy = false;
			this.selected = false;
			this.sprite = null;
			this.tint = 0xEEEEEE;
			this.highlight = GREEN;
		}
		getName(){
			var result = "TITLE: " + this.name.title;
			result += "\nFIRST: " + this.name.first;
			result += "\nLAST: " + this.name.last;
			return result;
		}
		getGender(){ return "GEN: " + this.gender; }
		getDOB(){ return "DOB:\n" + this.dob.dob; }
		getNAT(){ return "NAT: " + this.nat.nat; }
		getLocation(){
			var result = "STREET: " + this.location.street;
			result += "\nCITY: " + this.location.city;
			result += "\nZIP: " + this.location.zip;
			return result;
		}
		getPhone(){
			var result = "HOME:\n" + this.phone.home;
			result += "\nCELL:\n" + this.phone.cell;
			return result;
		}
		getLogin(){
			var result = "EMAIL: " + this.login.email;
			result += "\nUSER: " + this.login.username;
			result += "\nPASS: " + this.login.password;
			result += "\nMD5: " + this.login.md5;
			return result;
		}
		getKnownData(){
			var result = "TITLE: " + this.name.title;
			result += "\nFIRST: " + this.name.first;
			result += "\nLAST: " + this.name.last;
			result += "\n\nGEN: " + this.gender;
				
			result += "\n\nDOB ";
			if(this.dob.known){
				result += "\n" + this.dob.dob;
			}else{
				result += "\nUnknown";
			}

			result += "\n\nNAT: ";
			if(this.nat.known){
				result += this.nat.nat;
			}else{
				result += "Unknown";
			}

			result += "\n\nLOCATION";
			if(this.location.known){
				result += "\nSTREET:\n" + this.location.street;
				result += "\nCITY: " + this.location.city;
				result += "\nZIP: " + this.location.zip;
			}else{
				result += "\nUnknown";
			}

			result += "\n\n\nPHONE";
			if(this.phone.known){
				result += "\nHOME: " + this.phone.home;
				result += "\nCELL: " + this.phone.cell;
			}else{
				result += "\nUnknown";
			}

			result += "\n\nWEB";
			if(this.login.known){
				result += "\nEMAIL: " + this.login.email;
				result += "\nUSER: " + this.login.username;
				result += "\nPASS: " + this.login.password;
			}else{
				result += "\nUnknown";
			}
			return result;
		}
		getData(){
			var result; 
			if(this.spy){
				result = "--SPY--";
			}else{
				result = "--INNOCENT--";
			}
			result += "\n" + this.getName();
			result += "\n\n" + this.getGender();
			result += "\n\n" + this.getDOB();
			result += "\n\n" + this.getNAT();
			result += "\n\n" + this.getLocation();
			result += "\n\n" + this.getPhone();
			result += "\n\n\n" + this.getLogin();
			
			return result;
		}
	}

	var _getRandomInt = function(min, max) {
    	return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	const LIGHT_GREEN = 0x64DB58; 
	const GREEN = 0x27AC19;
	const DARK_GREEN = 0x074C00;
	const LIGHT_RED = 0xE1474F;
	const RED = 0xCE1E27;
	const DARK_RED = 0x7F0006;

	const SELECTED_ACTION_TINT = 0xFFFFFF;
	const HOVER_ACTION_TINT = 0xEEEEEE;
	const ACTION_TINT = 0x888888;

	var seconds;
	var spies = new Array();
	var stage = new PIXI.Container();
	
	
	var container;
	var loader = PIXI.loader;
	var resources = loader.resources;
	var canvas = document.getElementById("game-canvas");
	var rendererOptions = { view: canvas, antialias: false, transparent: false, resolution: 1 };
	var renderer = PIXI.autoDetectRenderer($("#page").width(), $("#page").height(), rendererOptions);
	renderer.backgroundColor = 0x222222 ;
	loader.add('house', '../img/house.png').load();

	var gameState = "";
	var clickState = "";
	var endTime = null;
	var seconds;
	var timerText;

	const PARANOIA_MAX = 150;
	const PARANOIA_BAR_HEIGHT = 20;
	const PARANOIA_BAR_X = 200;
	const PARANOIA_BAR_Y = renderer.height - PARANOIA_BAR_HEIGHT - 10;
	const ADD_PARANOIA = 50; 
	var paranoiaLevel = 0.5;
	var paranoiaText = new PIXI.Text("Community Paranoia",{
		fontFamily: 'Courier New',
		fontSize: 14,
		fill: LIGHT_GREEN
	});
	paranoiaText.x = PARANOIA_BAR_X;
	paranoiaText.y = PARANOIA_BAR_Y - 20;

	var graphics = new PIXI.Graphics();

	var spyText;
	var suspectText; 

	var selectActionText = new PIXI.Text("--Select action--", {
			fontFamily: 'Courier New',
			fontSize: 12,
			fill: LIGHT_GREEN
		});
	selectActionText.x = 10;
	selectActionText.y = 460;

	var actionContainer = new PIXI.DisplayObjectContainer();
	actionContainer.x = selectActionText.x;
	actionContainer.y = selectActionText.y + 20;
	actionContainer.visible = false;
	actionContainer.interactive = false;

	var text = new PIXI.Text("Remove target", {
			fontFamily: 'Courier New',
			fontSize: 12,
			fill: LIGHT_GREEN
	});
	var removeTargetText = new PIXI.Sprite(text.generateTexture(renderer));
	removeTargetText.tint = ACTION_TINT;
	removeTargetText.interactive = true;
	removeTargetText.on('pointerdown', function(event){
			for(var i = 0; i < actionContainer.children.length; i++){
				actionContainer.children[i].tint = ACTION_TINT;
			}
			this.tint = SELECTED_ACTION_TINT;
			clickState = "remove";
			console.log("Clickstate: " + clickState);
	});
	removeTargetText.x = 0;
	removeTargetText.y = 0;
	removeTargetText.on('pointerover', function(event){
			if(this.tint != SELECTED_ACTION_TINT){
				this.tint = HOVER_ACTION_TINT;
			}
	});
	removeTargetText.on('pointerout', function(event){
			if(this.tint != SELECTED_ACTION_TINT){
				this.tint = ACTION_TINT;
			}
	})
	actionContainer.addChild(removeTargetText);

	var text = new PIXI.Text("Survey target", {
			fontFamily: 'Courier New',
			fontSize: 12,
			fill: LIGHT_GREEN
	});
	surveyText = new PIXI.Sprite(text.generateTexture(renderer));
	surveyText.tint = ACTION_TINT;
	surveyText.interactive = true;
	surveyText.on('pointerdown', function(event){
			for(var i = 0; i < actionContainer.children.length; i++){
				actionContainer.children[i].tint = ACTION_TINT;
			}
			this.tint = SELECTED_ACTION_TINT;
			clickState = "survey";
			console.log("Clickstate: " + clickState);
	});
	surveyText.on('pointerover', function(event){
			if(this.tint != SELECTED_ACTION_TINT){
				this.tint = HOVER_ACTION_TINT;
			}
	});
	surveyText.on('pointerout', function(event){
			if(this.tint != SELECTED_ACTION_TINT){
				this.tint = ACTION_TINT;
			}
	});
	surveyText.x = 0;
	surveyText.y = 20;
	actionContainer.addChild(surveyText);

	var text = new PIXI.Text("Hack target", {
			fontFamily: 'Courier New',
			fontSize: 12,
			fill: LIGHT_GREEN
	});
	hackText = new PIXI.Sprite(text.generateTexture(renderer));
	hackText.tint = ACTION_TINT;
	hackText.interactive = true;
	hackText.on('pointerdown', function(event){
			for(var i = 0; i < actionContainer.children.length; i++){
				actionContainer.children[i].tint = ACTION_TINT;
			}
			this.tint = SELECTED_ACTION_TINT;
			clickState = "hack";
			console.log("Clickstate: " + clickState);
	});
	hackText.on('pointerover', function(event){
			if(this.tint != SELECTED_ACTION_TINT){
				this.tint = HOVER_ACTION_TINT;
			}
	});
	hackText.on('pointerout', function(event){
			if(this.tint != SELECTED_ACTION_TINT){
				this.tint = ACTION_TINT;
			}
	});
	hackText.x = 0;
	hackText.y = 40;
	actionContainer.addChild(hackText);

	text = new PIXI.Text("Mobile of target", {
			fontFamily: 'Courier New',
			fontSize: 12,
			fill: LIGHT_GREEN
	});
	mobileText = new PIXI.Sprite(text.generateTexture(renderer));
	mobileText.tint = ACTION_TINT;
	mobileText.interactive = true;
	mobileText.on('pointerdown', function(event){
			for(var i = 0; i < actionContainer.children.length; i++){
				actionContainer.children[i].tint = ACTION_TINT;
			}
			this.tint = SELECTED_ACTION_TINT;
			clickState = "phone";
			console.log("Clickstate: " + clickState);
	});
	mobileText.on('pointerover', function(event){
			if(this.tint != SELECTED_ACTION_TINT){
				this.tint = HOVER_ACTION_TINT;
			}
	});
	mobileText.on('pointerout', function(event){
			if(this.tint != SELECTED_ACTION_TINT){
				this.tint = ACTION_TINT;
			}
	});
	mobileText.x = 0;
	mobileText.y = 60;
	actionContainer.addChild(mobileText);

	text = new PIXI.Text("Search records", {
			fontFamily: 'Courier New',
			fontSize: 12,
			fill: LIGHT_GREEN
	});
	var searchText = new PIXI.Sprite(text.generateTexture(renderer));
	searchText.tint = ACTION_TINT;
	searchText.interactive = true;
	searchText.on('pointerdown', function(event){
			for(var i = 0; i < actionContainer.children.length; i++){
				actionContainer.children[i].tint = ACTION_TINT;
			}
			this.tint = SELECTED_ACTION_TINT;
			clickState = "birth";
			console.log("Clickstate: " + clickState);
	});
	searchText.on('pointerover', function(event){
			if(this.tint != SELECTED_ACTION_TINT){
				this.tint = HOVER_ACTION_TINT;
			}
	});
	searchText.on('pointerout', function(event){
			if(this.tint != SELECTED_ACTION_TINT){
				this.tint = ACTION_TINT;
			}
	});
	searchText.x = 0;
	searchText.y = 80;
	actionContainer.addChild(searchText);

	var endGameContainer = new PIXI.DisplayObjectContainer();
	
	var endGameTitle = new PIXI.Text("", {
		fontFamily: 'Courier New',
		fontSize: 40,
		fill: 0xFFFFFF
	});
	endGameTitle.x = 10;
	endGameTitle.y = 10;
	
	var endGameMsg = new PIXI.Text("",{
		fontFamily: 'Courier New',
		fontSize: 14,
		fill: 0xFFFFFF,
		wordWrap: true,
		wordWrapWidth: 500
	});
	endGameMsg.x = endGameTitle.x - 20;
	endGameMsg.y = endGameTitle.y + 60;
	
	var exit = new PIXI.Text("Exit", {
		fontFamily: 'Courier New',
		fontSize: 18,
		fill: 0xFFFFFF
	});
	
	var exitText = new PIXI.Sprite(exit.generateTexture(renderer));
	exitText.interactive = true;
	exitText.on('pointerdown', function(event){
		_exitGame();
	});
	exitText.on('pointerover', function(event){
		this.tint = RED;
	});
	exitText.on('pointerout', function(event){
		this.tint = 0xFFFFFF;
	});
	exitText.x = endGameMsg.x;
	exitText.y = endGameMsg.y + 100;
	endGameContainer.addChild(endGameTitle);
	endGameContainer.addChild(endGameMsg);
	endGameContainer.addChild(exitText);
	endGameContainer.x = (renderer.width - endGameContainer.width)/2 - 200;
	endGameContainer.y = (renderer.height - endGameContainer.height)/2 - 100;

	var startGame = function(){
		$("form").fadeOut("fast");
		$("#game-canvas").fadeIn("slow");
		_reset();
		_setup();
	}

	var _setup = function(){
		actionContainer.interactive = true;
		actionContainer.visible = true;

		timerText = new PIXI.Text("Get Ready", {
			fontFamily: 'Courier New',
			fontSize: 26,
			fill: '#EEEEEE'});
		timerText.x = renderer.width/2 - 60;
		timerText.y = renderer.height - 36;

		suspectText = new PIXI.Text("Suspect Info:\nSelect a person", {
			fontFamily: 'Courier New',
			fontSize: 14,
			fill: LIGHT_GREEN
		});
		suspectText.x = 10;
		suspectText.y = 10;

		container = new PIXI.DisplayObjectContainer();
		container.interactive = true;
		var size = $("#population-input .range-slider__range").val();
		$.ajax({
			url: 'https://randomuser.me/api/?results=' + size,
			dataType: 'json',
			success: function(data){
				for(var i = 0; i < size; i++){
					var person = new Person(data['results'][i]);
					var sprite = new PIXI.Sprite(resources.house.texture);
					sprite.anchor.set(0.5);
					sprite.x = (i % 10) * 70;
					sprite.y = 120*(Math.floor(i/10));
					sprite.width = 50;
					sprite.height = 50;
					sprite.person = person;
					if(_getRandomInt(1,5) == 5){
						sprite.person.spy = true;
						spies.push(sprite);
					}else{
						sprite.person.spy = false;
					}
					sprite.interactive = true;

					sprite.on('pointerdown', function(event){
						switch(clickState){
							case 'remove':
								this.person.selected = true;
								if(this.person.spy){
									this.person.tint = DARK_RED;
									this.person.highlight = RED;
									this.tint = this.person.highlight;
								}else{
									this.person.tint = 0x666666;
									this.person.highlight = DARK_GREEN;
									this.tint = this.person.highlight;
									paranoiaLevel += ADD_PARANOIA * 2;
								}
								suspectText.setText("Suspect Info:\n" + this.person.getData());
								break;
							case 'survey':
								this.person.location.known = true;
								suspectText.setText("Suspect Info:\n" + this.person.getKnownData());
								paranoiaLevel += ADD_PARANOIA;
								break;
							case 'hack':
								this.person.login.known = true;
								suspectText.setText("Suspect Info:\n" + this.person.getKnownData());
								paranoiaLevel += ADD_PARANOIA;
								break;
							case 'phone':
								this.person.phone.known = true;
								suspectText.setText("Suspect Info:\n" + this.person.getKnownData());
								paranoiaLevel += ADD_PARANOIA;
								break;
							case 'birth':
								this.person.nat.known = true;
								this.person.dob.known = true;
								suspectText.setText("Suspect Info:\n" + this.person.getKnownData());
								paranoiaLevel += ADD_PARANOIA;
								break;
						}
					});
					sprite.on('pointerover', function(event){
						this.tint = this.person.highlight;
						if(this.person.selected){
							suspectText.setText("Suspect Info:\n" + this.person.getData());
						}else{
							suspectText.setText("Suspect Info:\n" + this.person.getKnownData());
						}
					});
					sprite.on('pointerout', function(event){
						this.tint = this.person.tint;
						suspectText.setText("Suspect Info:\nSelect a person");
					});
					container.addChild(sprite);
					container.x = (renderer.width - container.width)/2;
					container.y = (renderer.height - container.height)/2;
					renderer.render(stage);
				}	
				stage.addChild(timerText);
				stage.addChild(suspectText);
				var spyIntel = _newSpyIntel();
				spyText = new PIXI.Text(spyIntel, {
					fontFamily: 'Courier New',
					fontSize: 12,
					fill: LIGHT_GREEN,
				});
				spyText.x = renderer.width - 180;
				spyText.y = 10;
				stage.addChild(spyText);
				_startTimer();
			}
		});

		stage.addChild(graphics);
		stage.addChild(selectActionText);
		stage.addChild(paranoiaText);
		stage.addChild(endGameContainer);		
		stage.addChild(actionContainer);
		stage.addChild(container);
		_animate();
	}

	var _newSpyIntel = function(){
		var result = "--Spy Intel--";
		if(spies.length == 0){
			var randomSpy = _getRandomInt(0, container.children.length - 1);
			container.children[randomSpy].person.spy = true;
			spies.push(container.children[randomSpy]);
		}
		for(var i = 0; i < spies.length; i++){
			result += "\n" + (i + 1) + "\n";
			var info = _getRandomInt(0,6);
			switch(info){
				case 0:
					result += spies[i].person.getName();
					break;
				case 1:
					result += spies[i].person.getGender();
					break;
				case 2:
					result += spies[i].person.getDOB();
					break;
				case 3:
					result += spies[i].person.getNAT();
					break;
				case 4:
					result += spies[i].person.getLocation();
					break;
				case 5:
					result += spies[i].person.getPhone();
					break;
				case 6:
					result += spies[i].person.getLogin();
					break;
			}
			result += "\n";
		}
		return result;
	}

	var _startTimer = function(){
		seconds = ($("#timer-input .range-slider__range").val()) * 1000;
		endTime = new Date();
		endTime.setTime(endTime.getTime() + seconds);
		gameState = 'play';
	}

	var _animate = function(){
		if(gameState == "won" || gameState == "time" || gameState == "paranoid"){
			_endGame(gameState);
			renderer.render(stage);
		}else if(gameState == "play"){
			_checkForSpies();
			_updateTimer();
			_updateParanoia();
			renderer.render(stage);
		}
		requestAnimationFrame(_animate);
	}

	var _endGame = function(gameState){
		if(!endGameContainer.visible && container.alpha <= 0){
			if(gameState == 'won'){
				endGameTitle.setText("Success!");
				endGameMsg.setText("All the spies have been caught. Everyone else shall be none the wiser...");
			}else if(gameState == 'paranoid'){
				endGameTitle.setText("Failure!");
				endGameMsg.setText(
					"You were too overt. Everyone got paranoid and decided they didn't like you looking so much into their lives. Oh, and the spies got away.");
			}else if(gameState == 'time'){
				endGameTitle.setText("Failure!");
				endGameMsg.setText("You ran out of time! The spies did something bad before you could stop them.");
			}
			container.visible = false;
			endGameContainer.visible = true;
			endGameContainer.interactive = true;
		}else{
			container.alpha -= .2;
		}
	}

	var _exitGame = function(){
		_reset();
		$("#game-canvas").fadeOut("fast");
		$("form").fadeIn("slow");
	}

	var _updateTimer = function(){
		var currentTime = new Date();
		var displayTime = new Date(endTime - currentTime),
			min = displayTime.getUTCMinutes(),
			sec = displayTime.getUTCSeconds(),
			ms = displayTime.getUTCMilliseconds();

		var time = (min > 9 ? min : "0" + min) + ":" + 
        (sec > 9 ? sec : "0" + sec) + "." + 
        (ms > 99 ? ms : ms > 9 ? "0" + ms : "00" + ms); 
		timerText.setText(time);


		if(endTime <= currentTime){
			timerText.setText("00:00.000");
			gameState = 'time';
		}
	}

	var _updateParanoia = function(){
		if(paranoiaLevel >= PARANOIA_MAX){
			gameState = 'paranoid';
		}else if(paranoiaLevel <= .3){
			paranoiaLevel = .3;
		}else{
			paranoiaLevel -= .3;
		}
		graphics.clear();
		graphics.beginFill(LIGHT_GREEN);
		graphics.drawRect(PARANOIA_BAR_X, PARANOIA_BAR_Y, paranoiaLevel, PARANOIA_BAR_HEIGHT);
		graphics.endFill();
	}

	var _checkForSpies = function(){
		var finished = true;
		for(var i = 0; i < spies.length; i++){
			if(!spies[i].person.selected){
				finished = false;
				break;
			}
		}
		if(finished){
			gameState = 'won';
		}
	}

	var _reset = function(){
		clickState = "";
		gameState = "";
		spies = new Array();
		endTime = null;
		endGameContainer.visible = false;
		endGameContainer.interactive = false;
		paranoiaLevel = .5;
		actionContainer.interactive = false;
		actionContainer.visible = false;
		for(var i = 0; i < actionContainer.children.length; i++)
		{
			actionContainer.children[i].tint = ACTION_TINT;
		}
		for (var i = stage.children.length - 1; i >= 0; i--) 
			{ stage.removeChild(stage.children[i]); };
	}

	return{
		startGame: startGame,
	}
});

var module;

$(document).ready(function(){
  $('input[type=range]').on('input', function () {
    $(this).trigger('change');
  });
  $(".range-slider__range").change(function(){
    var newval=$(this).val();
    $(this).parent().find(".range-slider__value").text(newval);
  });

  module = FindSpy();

  $("#start-button").click(function(e){
  	e.preventDefault();
  	module.startGame();
  });
});
