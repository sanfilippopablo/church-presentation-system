module.exports = function(socket, Songs, currentState) {

  // == MANAGEMENT ==

  // Create
  socket.on('song:create', function(song) {
    song.creationDate = new Date();
    Songs.insert(song, function(err, obj) {
      socket.emit('song:created', obj);
    })
  });

  // Update
  socket.on('song:update', function(id, data) {
    Songs.update({_id: id}, data, {}, function(err, numReplaced, obj) {
      socket.emit('song:updated', obj);
    })
  });

  // Delete
  socket.on('song:delete', function(id) {
    Songs.remove({_id: id}, {}, function(err, numRemoved) {
      socket.emit('song:deleted');
    })
  });

  // Query
  socket.on('song:query', function(text) {
    /*

    Acá va a estar la magia de lunr.js
    Song.query(text, function(err, songs) {
      socket.emit('song:queryresult', songs);
    })
    */
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
