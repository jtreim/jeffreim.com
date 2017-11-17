var mongoose = require('mongoose');
require('../models/Game');
var Game = mongoose.model('Game');

var getAll = function(next){
 console.log('dbTool getAll called!');
 Game.find(function(err, games){
  if(err){ return next(err); }
  return games;
 });
}

var get = function(input, next){
 console.log('dbTool get called!');
}

var add = function(input, next){
 console.log('dbTool add called!');
 var game = new Game(input);
 game.save(function(err, game){
  if(err){ return next(err); }
  return game;
 });
}

var id = function(id, req, next){
 console.log('dbTool id called!');
 var query = Game.findById(id);
 query.exec(function (err, game){
  if(err) { return next(err); }
  if(!game){ return next(new Error("can't find game")); }
  req.game = game;
  return next();
 });
}

var remove = function(input, next){
 console.log('dbTool remove called!');
};

module.exports.get = get;
module.exports.getAll = getAll;
module.exports.id = id;
module.exports.add = add;
module.exports.remove = remove;
