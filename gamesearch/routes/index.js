var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Game = mongoose.model('Game');

/* GET home page. */
router.get('/', function(req, res, next) {
 Game.find(function(err, games){
  if(err){ return next(err); }
  res.render('index', {
   title: 'gamesth',
   games: games
  });
 });
});

router.get('/games', function(req, res, next){
 console.log('Looking up games...');
 Game.find(function(err, games){
  if(err){ return next(err); }
  console.log(games);
  res.json(games);
 });
});

router.delete('/game/:game', function(req, res){
 console.log("In delete.");
 req.game.remove();
 res.sendStatus();
});

router.delete('/game', function(req,res,next){
 Game.remove({},function(err){
  if(err) return console.error(err);
  });
 Game.find(function(err, gameList){
  if(err) return console.error(err);
  else{
   console.log(gameList);
  }
 });
 res.sendStatus(200);
});

module.exports = router;
