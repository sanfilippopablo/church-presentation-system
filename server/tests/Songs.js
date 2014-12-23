var should = require('should');
var assert = require('assert');
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

  describe('song:create', function() {

    it('should respond with song:created and the object created on the DB', function(done) {
      var client = io.connect(connectionString, options);
      var song = {
        'title': 'Fidelidad',
        'verses': [
          {
            id: 1,
            type: 'chorus',
            lines: [
              'Fidelidad, tu fidelidad',
              'Tan profunda, tan real',
              'En mi vida, al caminar',
              'Me basta tu fidelidad'
            ]
          }
        ]
      }
      client.on('connect', function() {
        client.on('song:created', function(obj) {
          obj.should.be.ok;
          obj.should.have.property('_id');
          obj.should.have.property('title', song.title);
          obj.should.have.property('creationDate')
          done();
        })
      })
      client.emit('song:create', song);
    });
  })

})
