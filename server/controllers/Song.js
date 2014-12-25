var async = require('async');

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
    var results = Songs.index.search(text);


    if ( !results ) {
      socket.emit('song:queryresult', []);
      return;
    }
    async.map(results, function(item, cb){
      Songs.findOne({_id: item.ref}, function(err, song){
        song.score = item.score;
        cb(null, song);
      })
    }, function(err, results){
      socket.emit('song:queryresult', results)
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
