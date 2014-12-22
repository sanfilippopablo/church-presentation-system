module.exports = function(socket, Song, currentState) {

  // == MANAGEMENT ==

  // Create
  socket.on('song:create', function(song) {

  });

  // Update
  socket.on('song:update', function(id, data) {

  });

  // Delete
  socket.on('song:delete', function(id) {

  });

  // Query
  socket.on('song:query', function(text) {

  });


  // == LIVE ==

  // Select song
  socket.on('live:song:select-song', function(id) {
    /*
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
    */
  })

  // Select verse
  socket.on('live:song:select-verse', function(index) {
    /*

    // Update currentState
    currentState.data.selectedVerse = index;

    // Notify
    socket.emit('live:song:verse-selected ', currentState);
    */
  })

}
