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

  beforeEach(function(done){
    server = require('../index').server;
    done();
  })

  describe('song:create', function() {

    it('should respond with song:created and the object created on the DB', function(done) {
      var client = io.connect('http://localhost');
      var song = {
        'title': 'Tu amor por mí'
      }
      client.on('connect', function() {
        client.on('song:created', function(obj) {
          obj.should.be.ok;
          obj.should.have.property('_id');
          obj.should.have.property('title', song.title);
          client.disconnect();
          done();
        })
      })
      client.emit('song:create', song);
    })
  });
  
})
