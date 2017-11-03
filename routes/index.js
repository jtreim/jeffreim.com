var express = require('express');
var db = require('../tools/data');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('index.html', { root: 'public' });
});


/* GET init info. */
router.get('/init', function(req, res){
  var data = {
  	users: db.users
  };
  res.send(data);
});

module.exports = router;
