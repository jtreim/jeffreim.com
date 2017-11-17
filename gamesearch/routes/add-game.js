var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Game = mongoose.model('Game');

router.get('/', function(req, res, next){
 res.render('add', { title: 'gamesth | Add' });
});

router.post('/', function(req, res, next){
 var info = req.body;
 console.log('title: ' + info.title);
 console.log('picUrl: ' + info.picUrl);
 console.log('url: ' + info.url);
 console.log('added_by: ' + info.added_by);
 console.log('description: ' + info.description);
 var game = new Game(info);
 game.save(function(err, game){
  if(err){ return next(err); }
  res.json(game);
 });
});

module.exports = router;
