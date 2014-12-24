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

var lunr = require('lunr');
require('../node_modules/lunr-languages/lunr.stemmer.support.js')(lunr);
require('../node_modules/lunr-languages/lunr.es.js')(lunr);

var db = {};
db.songs = new Datastore({filename: conf.dbPath('songs'), autoload: true});

var songsIndex = lunr(function () {
  // use the language (es)
  this.use(lunr.es);

  this.pipeline.add(function (token, tokenIndex, tokens) {
    return token.replace(/[HhBbVvh]+/g, '')
  })

  // then, the normal lunr index initialization
  this.field('title', { boost: 10 })
  this.field('body')
  this.ref('_id')
});

// Fill songIndex with data
db.songs.find({}, function(err, docs){
  for (var i = 0; i < docs.length; i++) {
    var viceVerses = _.map(docs[i].verses, function(verse){return verse.lines.join('\n')});
    songsIndex.add({
      _id: docs[i]._id,
      title: docs[i].title,
      body: viceVerses.join('\n')
    })
  }
})

// Serving webapps
app.use('/admin', express.static(path.join(__dirname, '../public/admin')));
app.use('/live', express.static(path.join(__dirname, '../public/live')));
app.use('/libs', express.static(path.join(__dirname, '../public/libs')));

var currentState = {};

// socket.io server
io.sockets.on('connection', function (socket) {

  // Songs
  require('./controllers/Song')(socket, db.songs, songsIndex, currentState);
});

server.listen(conf.port, function(){
  console.log('Server listening at ', conf.port)

});

module.exports.server = server;
module.exports.db = db;
