module.exports = function(socket, Song, currentState) {

  // == MANAGEMENT ==

  // Create
  socket.on('song:create', function(song) {
    Song.create(song, function(err, obj) {
      socket.emit('song:created', obj);
    })
  });

  // Update
  socket.on('song:update', function(id, data) {
    Song.findByIdAndUpdate(id, data, function(err, obj) {
      socket.emit('song:updated', obj);
    })
  });

  // Delete
  socket.on('song:delete', function(id) {
    Song.findByIdAndRemove(id, function(err, obj) {
      socket.emit('song:deleted', obj);
    })
  });

  // Query
  socket.on('song:query', function(text) {
    Song.query(text, function(err, songs) {
      socket.emit('song:queryresult', songs);
    })
  });


  // == LIVE ==

  // Select song
  socket.on('live:song:select-song', function(id) {
    Song.findById(id, function(err, song){

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
