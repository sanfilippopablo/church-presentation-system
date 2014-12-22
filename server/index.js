var environment = process.env.NODE_ENV

var express = require('express');
var app = express();
var server = require('http').Server(app);
exports.server = server;
var io = require('socket.io')(server);
var path = require('path');

var conf = require('./config')[environment];

// Serving webapps
app.use('/admin', express.static(path.join(__dirname, '../public/admin')));
app.use('/live', express.static(path.join(__dirname, '../public/live')));
app.use('/libs', express.static(path.join(__dirname, '../public/libs')));

var currentState = {};

// socket.io server
io.sockets.on('connection', function (socket) {

  // Songs
  require('./controllers/Song')(socket, currentState);
});

server.listen(conf.port, function(){
  console.log('Server started and listening in ', conf.port)
});
