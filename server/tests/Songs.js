var should = require('should');
var assert = require('assert');
var io = require('socket.io-client');
var server
var options = {
  transports: ['websocket'],
  'force new connection': true
}
var Datastore = require('nedb');
var db = new Datastore({filename: '../../songs.db', autoload: true});
var conf = require('../config')[process.env.NODE_ENV];
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
        'verses': [{
          id: 1,
          type: 'chorus',
          lines: [
            'Fidelidad, tu fidelidad',
            'Tan profunda, tan real',
            'En mi vida, al caminar',
            'Me basta tu fidelidad'
          ]
        }]
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

  describe('song:delete', function() {
    var id = "vaJKoz7CJJRlDvaA";
    it('should delete the object in the DB and respond with song:deleted', function(done) {
      var client = io.connect(connectionString, options);
      client.on('connect', function() {
        client.on('song:deleted', function() {
          // It should not be in the DB
          db.findOne({_id: id}, function(err, doc){
            should(doc).be.null;
            done();
          })
        })
      })
      client.emit('song:delete', id);
    });
  })

})
