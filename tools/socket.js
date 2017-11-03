module.exports = function(io, db){
	io.on('connection', function(socket){
		console.log('++++Client ' + socket.id + ' connected.');
		var id = socket.id;
		var name = "";
		
		socket.on('register', function(data){
			db.addUser(data.name, id);
			var user = db.getUser(id);
			io.to(id).emit('reply', 
				{ 
					register: 'success', 
					name: user.name,
					icon: user.icon
				});
			name = data.name;
			socket.broadcast.emit('newClient', user);

			var news = name + " just joined!";
			var d = db.addServerChat(news);
			socket.broadcast.emit('chat', d);
		});

		socket.on('chat', function(data){
			db.addChat(data.sender, data.msg);
			console.log('\t' + data.sender + ': ' + data.msg);
			socket.broadcast.emit('chat', data);
		});

		socket.on('disconnect', function(){
			db.removeUser(id);
			console.log('++++' + name + ' just left. . .')
			
			var news = name + " just left.";
			var d = db.addServerChat(news);
			if(name != ""){
				socket.broadcast.emit('left', { id: id });
				socket.broadcast.emit('chat', d);
			}
		})
	});
}

