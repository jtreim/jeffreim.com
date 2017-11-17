var mongoose = require('mongoose');
var GameSchema = new mongoose.Schema({
 title: String,
 picUrl: String,
 url: String,
 added_by: String,
 description: String
});
mongoose.model('Game',GameSchema);
