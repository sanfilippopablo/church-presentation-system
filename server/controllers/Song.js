module.exports = function(socket, Song) {

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
}
