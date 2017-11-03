var users = [];
var groups = [];
var chat = [];
var serverName = "\t[NEWS] :";

var _getRandomInt = function(min, max){
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max-min+1)) + min;
}

var ICONS = [
	"airplane-icon", "bullhorn-icon", "eye-icon", "mind-map-icon", "money-icon", "motorbike-helmet-icon", "shopping-cart-icon",
	"camera-icon", "controller-icon", "feather-icon", "line-icon", "monitor-icon", "palette-icon", "piggybank-icon", "printer-icon",
	"space-shuttle-icon"
];

class User{
	constructor(name, id){
		this.name = name;
		this.id = id;
		this.groups = [];
		this.icon = ICONS[(_getRandomInt(0, ICONS.length - 1))];
	}

	joinGroup(group){
		this.groups.push(group);
	}
}

class Group{
	constructor(name, user){
		this.name = name;
		this.users = [];
		this.users.push(user);
	}
}

class ChatMsg{
	constructor(sender, msg){
		this.sender = sender;
		this.msg = msg;
	}
}

var addChat = function(sender, msg){
	var chatMsg = new ChatMsg(sender, msg);
	chat.push(chatMsg);
}

var addServerChat = function(msg){
	var chatMsg = new ChatMsg(serverName, msg);
	chatMsg.server = true;
	chat.push(chatMsg);
	return chatMsg;
}

var addUser = function(name, id){
	users.push(new User(name, id));
}

var removeUser = function(id){
	var i = 0;
	for(i; i < users.length; i++){
		if(users.id == id){
			break;
		}
	}
	users.splice(i, 1);
}

var joinGroup = function(id, groupName){
	var user = users[id];
	if(!user.groups.includes(groupName)){
		user.groups.push(groupName);
	}
}

var getUser = function(id){
	for(var i = 0; i < users.length; i++){
		if(users[i].id == id){
			return users[i];
		}
	}
}

var getUsers = function(){
	var result = [];
	users.forEach(function(el){
		result.push(el.name);
	});
	return result;
}


module.exports.users = users;
module.exports.groups = groups;
module.exports.getUser = getUser;
module.exports.addUser = addUser;
module.exports.joinGroup = joinGroup;
module.exports.removeUser = removeUser;

module.exports.chat = chat;
module.exports.addChat = addChat;
module.exports.addServerChat = addServerChat;