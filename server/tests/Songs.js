var should = require('should');
var assert = require('assert');
var io = require('socket.io-client');
var db;
var fs = require('fs-extra');
var path = require('path');
var conf = require('../config')[process.env.NODE_ENV];
var Datastore = require('nedb');
var dbPath = conf.dbPath('songs');
var fixturePath = conf.fixturePath('songs');
console.log('fixpath ', fixturePath, dbPath)
var connectionString = 'http://localhost:' + conf.port;
var server;
var options = {
  transports: ['websocket'],
  'force new connection': true
}
var fixtures = require('./songs-fixture');

describe('Songs Endpoint', function() {

  beforeEach(function(done) {

    // Start the server
    var index = require('../index');
    server = index.server;
    db = index.db.songs;

    console.log(db)

    // Load fixtures in the DB
    db.remove({}, {multi: true}, function(err, numRemoved){
      db.insert(fixtures, done);
    })

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
      // Make sure the song exists in DB
      db.findOne({_id: id}, function(err, doc) {
        should(doc).be.ok;
        var client = io.connect(connectionString, options);
        client.on('connect', function() {
          client.on('song:deleted', function() {
            db.findOne({_id: id}, function(err, doc) {
              should(doc).be.null;
              done();
            })
          })
        })
        client.emit('song:delete', id);
      })
    });
  })

})
