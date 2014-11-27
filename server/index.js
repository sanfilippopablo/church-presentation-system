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

server.listen(80);

// Serving webapps
app.use('/admin', express.static(path.join(__dirname, '../public/admin')));
app.use('/live', express.static(path.join(__dirname, '../public/live')));
app.use('/libs', express.static(path.join(__dirname, '../public/libs')));

// socket.io server
io.on('connection', function (socket) {

  // SONGS //
  // Create
  socket.on('song:create', function(song) {
    Song.create(song, function(err, obj){
      socket.emit('song:created', obj);
    })
  });

  // Update
  socket.on('song:update', function(id, data) {
    Song.findByIdAndUpdate(id, data, function(err, obj){
      socket.emit('song:updated', obj);
    })
  });

  // Delete
  socket.on('song:delete', function(id) {
    Song.findByIdAndRemove(id, function(err, obj){
      socket.emit('song:deleted', obj);
    })
  });

  // Query
  socket.on('song:query', function(text) {
    Song.query(text, function(err, songs){
      socket.emit('song:queryresult', songs);
    })
  });

});
