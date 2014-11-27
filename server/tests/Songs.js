var should = require('should');
var assert = require('assert');
var mongoose = require('mongoose');
var io = require('socket.io-client');
var server;
var options = {
  transports: ['websocket'],
  'force new connection': true
}

describe('Songs Endpoint', function() {

  // Restart server before each test
  beforeEach(function(done) {
    server = require('../index');
    done();
  })

  afterEach(function(done){
    mongoose.connection.close(done);
  })

  describe('Echo', function() {

    it('should echo', function(done) {
      var client = io.connect('http://localhost');
      var the_data = "wegreh"
      client.on('connect', function() {
        client.on('response', function(data) {
          data.should.equal(the_data);
          client.disconnect();
          done();
        })
      })
      client.emit('echo', the_data)
    })
  })
})
