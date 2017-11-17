module.exports = function(io, dbTool){
	io.on('connection', function(socket){
		console.log('++++Client ' + socket.id + ' connected.');
		var id = socket.id;
		var name = "";
		
		socket.on('register', function(data){
			dbTool.addUser(data.name, id);
			var user = dbTool.getUser(id);
			io.to(id).emit('reply', 
				{ 
					register: 'success', 
					name: user.name,
					icon: user.icon
				});
			name = data.name;
			socket.broadcast.emit('newClient', user);

			var news = name + " just joined!";
			var d = dbTool.addServerChat(news);
			socket.broadcast.emit('chat', d);
		});

		socket.on('chat', function(data){
			dbTool.addChat(data.sender, data.msg);
			console.log('\t' + data.sender + ': ' + data.msg);
			socket.broadcast.emit('chat', data);
		});

		socket.on('disconnect', function(){
			dbTool.removeUser(id);
			console.log('++++' + name + ' just left. . .')
			
			var news = name + " just left.";
			var d = dbTool.addServerChat(news);
			if(name != ""){
				socket.broadcast.emit('left', { id: id });
				socket.broadcast.emit('chat', d);
			}
		})
	});
}