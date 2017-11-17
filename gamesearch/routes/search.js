var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Game = mongoose.model('Game');

router.get('/',function(req, res, next){
 res.render('search', { title: 'gamesth | Search' });
});

router.get('/query', function(req,res,next){
 console.log('Looking up games with title = ' + req.query.q);
 var query = req.query.q;
 Game.find({ 'title': query }, function(err, games){
  if(err){ return next(err); }
  console.log(games);
  res.json(games);
 });

});

module.exports = router;
