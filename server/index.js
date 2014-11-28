var environment = process.env.NODE_ENV

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var connection = mongoose.connection;
var Song = require('./models/Song')(mongoose);

server.listen(8080);

// Serving webapps
app.use('/admin', express.static(path.join(__dirname, '../public/admin')));
app.use('/live', express.static(path.join(__dirname, '../public/live')));
app.use('/libs', express.static(path.join(__dirname, '../public/libs')));

// socket.io server
io.on('connection', function (socket) {

  // Songs
  require('./controllers/Song')(socket, Song);

  socket.on('echo', function(data){
    socket.emit('response', data)
  })

});

exports.server = server;
