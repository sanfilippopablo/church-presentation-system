var dbconf = require('./db');
var _ = require('underscore');
var async = require('async');
var db = dbconf.db;
var index = dbconf.index;
var songs = {};

songs.db = db;
songs.index = index;

songs.create = function(songs, cb) {
  single = songs.toString() === '[object Object]'
    // Si es una sola, convertir a array
  if (single) {
    songs = [songs];
  }

  // Agregar creationDate
  for (var i = 0; i < songs.length; i++) {
    songs[i].creationDate = new Date();
  }

  // Insert in DB
  db.insert(songs, function(err, songs) {
    async.map(songs, function(song, asynccb) {

      // Get body from verses array
      var body = _.map(song.verses, function(verse) {
        return verse.lines.join('\n')
      }).join('\n');

      // Add to index
      index.add({
        _id: song._id,
        title: song.title,
        body: body
      });

      asynccb(null, song);
    }, function(err, songs) {
      // If he sent one, he is expecting one
      if (single) {
        cb(err, songs[0]);
      } else {
        cb(err, songs);
      }
    })
  })
}

songs.update = function(id, data, cb) {

  // Update on DB
  db.update({
    _id: id
  }, data, {}, function(err, numReplaced) {
    cb(err);
  })
}

songs.delete = function(id, cb) {

  // Remove from index
  index.remove({
    _id: id
  });

  // Remove from DB
  db.remove({
    _id: id
  }, {}, function(err, numRemoved) {
    cb(err);
  })
}

songs.query = function(text, cb) {

  var results = index.search(text);
  async.map(results, function(item, asynccb) {
    db.findOne({
      _id: item.ref
    }, function(err, song) {
      song.score = item.score;
      asynccb(null, song);
    })
  }, cb)


}

module.exports = songs;
