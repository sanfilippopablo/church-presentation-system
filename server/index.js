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
  socket.on('song:create', function(data){
    console.log(data);
    var l = new Song(data);
    l.save();
  })
});
