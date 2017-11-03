var socket = io.connect('/');

var app = window.angular.module('app', ['ngAnimate'])
app.controller('mainCtrl', mainCtrl);
function mainCtrl($scope, $timeout, $http){
	
	$scope.name = "";
	$scope.users = [];
	$scope.chat = [];

	$scope.msg = "";

	$scope.register = function(){
		var name = $scope.clientName;
		socket.emit('register', { name: name });
		$scope.name = name;
	}

	socket.on('reply', function(data){	
		var form = angular.element(document.querySelector('#register-form'));
		var room = angular.element(document.querySelector('#chat-room'));
		var board = angular.element(document.querySelector('#chat-board'));
		var group = angular.element(document.querySelector('#chat-group'));

		form.addClass('hide');
		group.addClass('fade-in');
		group.removeClass('hide');
		room.addClass('fade-in');
		room.removeClass('hide');
		board.addClass('fade-in');
		board.removeClass('hide');
		
		$http
		 .get('init')
		 .then(function(resp){
		 	$scope.users = resp.data.users;
		 	$scope.chatMsgs = [];
		 });
	})

	socket.on('newClient', function(data){
		console.log(data.name + " has just joined!");
		$scope.users.push(data);
		$scope.$apply();
	});

	$scope.addChat = function(){
		var msg = {
			sender: $scope.name,
			msg: $scope.msg
		};
		$scope.msg = "";
		$scope.chat.push(msg);
		socket.emit('chat', msg);
	}

	$scope.isServerChat = function(msg){
		if(msg.server){
			return 'server-name';
		}else{
			return 'chat-name';
		}
	}

	socket.on('chat', function(data){
		$scope.chat.push({sender: data.sender, msg: data.msg, server: data.server});
		$scope.$apply();
	});

	socket.on('left', function(data){
		var i = 0;
		for(i; i < $scope.users.length; i++){
			if($scope.users[i].id == data.id){
				break;
			}
		}
		$scope.users.splice(i,1);
		$scope.$apply();
	});
}