var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');

server.listen(8000);

// Serving webapps
app.use('/admin', express.static(path.join(__dirname, '../public/admin-app')));
app.use('/presentation', express.static(path.join(__dirname, '../public/presentation-app')));

// socket.io server
io.on('connection', function (socket) {
	console.log('New connection.');

	socket.on('echo', function(data){
		console.log("Echo received")
		socket.emit('response', data)
	})
});
