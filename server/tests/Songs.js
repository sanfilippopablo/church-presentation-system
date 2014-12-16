var should = require('should');
var assert = require('assert');
var mongoose = require('mongoose');
var io = require('socket.io-client');
var server
var options = {
  transports: ['websocket'],
  'force new connection': true
}
var conf = require('../config')[process.env.NODE_ENV]
var connectionString = 'http://localhost:' + conf.port;

describe('Songs Endpoint', function() {

  beforeEach(function(done) {
    // start the server
    server = require('../index').server;
    done();
  });

  it('should respond with song:created and the object created on the DB', function(done) {
    var client = io.connect(connectionString, options);
    var song = {
      'title': 'Tu amor por mí'
    }
    client.on('connect', function() {
      client.on('song:created', function(obj) {
        obj.should.be.ok;
        obj.should.have.property('_id');
        obj.should.have.property('title', song.title);
        done();
      })
    })
    client.emit('song:create', song);
  });

})
