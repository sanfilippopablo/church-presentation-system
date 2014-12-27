var songs = require('./model');
var async = require('async');

module.exports = function(socket, currentState) {

  // == MANAGEMENT ==

  // Create
  socket.on('song:create', function(song) {
    songs.create(song, function(err, obj) {
      socket.emit('song:created', obj);
    })
  });

  // Update
  socket.on('song:update', function(id, data) {
    songs.update(id, data, function(err, obj) {
      socket.emit('song:updated', obj);
    })
  });

  // Delete
  socket.on('song:delete', function(id) {
    songs.delete(id, function(err) {
      socket.emit('song:deleted');
    })
  });

  // Query
  socket.on('song:query', function(text) {
    songs.query(text, function(err, results){
      socket.emit('song:queryresult', results);
    })

  });


  // == LIVE ==

  // Select song
  socket.on('live:song:select-song', function(id) {
    Songs.findOne({_id: id}, function(err, song){

      // Mark first verse as selected
      song.verses[0]['selected'] = true;

      // Update currentState
      currentState = {
        'type': 'song',
        'data': {
          'song': song,
          'selectedVerse': 0
        }
      }

      // Notify
      socket.emit('live:song:song-selected', currentState);
    })
  })

  // Select verse
  socket.on('live:song:select-verse', function(index) {

    // Update currentState
    currentState.data.selectedVerse = index;

    // Notify
    socket.emit('live:song:verse-selected ', currentState);
  })

}
