var environment = process.env.NODE_ENV

var express = require('express');
var app = express();
var server = require('http').Server(app);
exports.server = server;
var io = require('socket.io')(server);
var path = require('path');
var Datastore = require('nedb');
var conf = require('./config')[environment];
var _ = require('underscore');

var db = {};

// == SONGS ==

// DB
require('./songs/db')(conf, db);

// Serving webapps
app.use('/admin', express.static(path.join(__dirname, '../public/admin')));
app.use('/live', express.static(path.join(__dirname, '../public/live')));
app.use('/libs', express.static(path.join(__dirname, '../public/libs')));

var currentState = {};

// socket.io server
io.sockets.on('connection', function (socket) {

  // Songs
  require('./controllers/Song')(socket, db.songs, currentState);
});

server.listen(conf.port, function(){
  console.log('Server listening at ', conf.port)

});

module.exports.server = server;
module.exports.db = db;
