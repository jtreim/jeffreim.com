var blob;
var timeouts = [];
var began = false;
var state = 'shape';
const STARTING_MSGS = ["This is an empty website.", "Pictures are worth a thousand words, but empty ones say nothing.", 
        "They're simply lifeless.","So if you were to draw on an empty screen . . .",
        "could you create life?"];

angular.module('Broken', ['ngAnimate', 'ui.router'])
  .config([
  	'$stateProvider',
  	'$urlRouterProvider',
  	function($stateProvider, $urlRouterProvider){
  		$stateProvider
  		  .state('start', {
  		  	url:'/start',
  		  	templateUrl: '/start.html',
  		  	controller: 'StartCtrl'
  		  })
        .state('blob', {
          url: '/blob/{id}',
          templateUrl: '/blob.html',
          controller: 'BlobCtrl'
        });

  		$urlRouterProvider.otherwise('start');
  	}])
  	.factory('dataFactory', [
      '$location',
      '$timeout',
      function($location, $timeout){

  		// Add any public data to share between states.
      var msg = document.querySelector("#message");

      var clearMsgs = function(){
        timeouts.forEach(function(t){
          $timeout.cancel(t);
        })
      }
      var go = function(b){
        clearMsgs();
        blob = b;
        $location.path('/blob/' + b.id);
        timeouts = [];
      }

      BrokenModule.setGo(go);

      return {
        msg: msg,
        go: go,
        clearMsgs: clearMsgs,
      }
    }])
    .controller('StartCtrl', [
      '$scope',
      '$timeout',
      '$location',
      'dataFactory',
      function($scope, $timeout, $location, dataFactory){

        //Init data and functions.
        $scope.msg = angular.element(dataFactory.msg);
        $scope.go = dataFactory.go;
        $scope.clearMsgs = dataFactory.clearMsgs;

        $scope.startMsgs = function(){
          timeouts.push($timeout(function(){
            $scope.displayNewMsg(STARTING_MSGS[0]);
          }, 2000));
          timeouts.push($timeout(function(){
            $scope.displayNewMsg(STARTING_MSGS[1]);
          }, 5000));
          timeouts.push($timeout(function(){
            $scope.displayNewMsg(STARTING_MSGS[2]);
          }, 8000));
          timeouts.push($timeout(function(){
            $scope.displayNewMsg(STARTING_MSGS[3]);
          }, 11000));
          timeouts.push($timeout(function(){
            $scope.displayNewMsg(STARTING_MSGS[4]);
          }, 14000));
        }

        $scope.displayNewMsg = function(text){
          $scope.text = text;
          $scope.msg.addClass("display-msg");
          timeouts.push($timeout(function(){
            $scope.msg.addClass("hide");
            $scope.msg.removeClass("display-msg");
          }, 2800));
        } 

        //Add implementation
        if(!began){
          $scope.startMsgs();
        }
    }])
    .controller('BlobCtrl', [
      '$scope',
      '$timeout',
      '$location',
      'dataFactory',
      function($scope, $timeout, $location, dataFactory){
        
        //Gets the public data.
        $scope.msg = angular.element(dataFactory.msg);
        $scope.blob = blob;
        $scope.go = dataFactory.go;
        $scope.clearMsgs = dataFactory.clearMsgs;
        
        //Add implementation
        $scope.displayNewMsg = function(text){
          $scope.text = text;
          $scope.msg.addClass("display-msg");
          $timeout(function(){
            $scope.msg.addClass("hide");
            $scope.msg.removeClass("display-msg");
          }, 2800);
        }
        $scope.homeLink = function(){
          state = 'shape';
          $location.path('/start/');
        }
  	}])