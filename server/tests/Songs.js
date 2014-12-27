var should = require('should');
var assert = require('assert');
var async = require('async');
var _ = require('underscore');
var io = require('socket.io-client');
var songs;
var fs = require('fs-extra');
var path = require('path');
var conf = require('../config')[process.env.NODE_ENV];
var Datastore = require('nedb');
var dbPath = conf.dbPath('songs');
var fixturePath = conf.fixturePath('songs');
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

    // Load fixtures in the DB
    songs = require('../songs/model');
    songs.create(fixtures, done);
  });

  afterEach(function(done){
    songs.db.find({}, function(err, docs){
      async.each(docs, function(item, asynccb) {
        songs.delete(item._id, asynccb)
      }, done)
    })
  })

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
      db.findOne({
        _id: id
      }, function(err, doc) {
        should(doc).be.ok;
        var client = io.connect(connectionString, options);
        client.on('connect', function() {
          client.on('song:deleted', function() {
            db.findOne({
              _id: id
            }, function(err, doc) {
              should(doc).be.null;
              done();
            })
          })
        })
        client.emit('song:delete', id);
      })
    });
  })

  describe('song:update', function() {
    var id = "vaJKoz7CJJRlDvaA";
    var newTitle = 'Vale más que el cielo';
    it('should update the object in the DB and respond with song:update', function(done) {
      // Make sure the song exists in DB
      db.findOne({
        _id: id
      }, function(err, doc) {
        doc.title.should.be.equal('Yo tengo un tesoro');
        var client = io.connect(connectionString, options);
        client.on('connect', function() {
          client.on('song:updated', function() {
            db.findOne({
              _id: id
            }, function(err, doc) {
              doc.title.should.be.equal(newTitle);
              done();
            })
          })
        })
        client.emit('song:update', id, {
          title: newTitle
        });
      })
    });
  })

  describe('song:query', function() {
    var queries = [{
      query: 'te alavo',
      result: ["hYX5KDE9cuvszKam"]
    }, {
      query: 'tu fidelidad',
      result: ["GY3RINMScEz6Ncxj", "lAU3pgJNFJYxbDRW"]
    }, {
      query: 'tu amor por mi',
      result: ["hYX5KDE9cuvszKam"]
    }, {
      query: 'bale mas que el cielo',
      result: ["vaJKoz7CJJRlDvaA"]
    }, {
      query: 'como tu',
      result: ["GY3RINMScEz6Ncxj"]
    }, {
      query: 'mi salvador',
      result: ["vaJKoz7CJJRlDvaA"]
    }, {
      query: 'miel',
      result: ["hYX5KDE9cuvszKam"]
    }]
    it('should respond to song:query with song:queryresult and an array of results', function(done) {
      var iterator = function(item, cb){


        var client = io.connect(connectionString, options);
        client.on('connect', function() {


          client.on('song:queryresult', function(results) {


            var resultsIds = _.map(results, function(result){return result._id});
            // The actual check
            for (var i = 0; i < item.result.length; i++) {
              resultsIds.should.containEql(item.result[i]);
            }
            cb();
          })
        })
        client.emit('song:query', item.query);
      }

      async.each(queries, iterator, done);

    });
  })

})
