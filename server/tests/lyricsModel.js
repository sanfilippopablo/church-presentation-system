var should = require('should');
var assert = require('assert');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var connection = mongoose.connection;
var Lyric = require('../models/Lyric')(mongoose);

describe('Lyric model', function(){

  // HOOKS //

  // Drop database before tests
  before(function(done){
    connection.on('open', function(){
      connection.db.dropDatabase(done);
    })
  })

  // Close connection after tests
  after(function(done){
    connection.close(done);
  })

  // Load fixtures before each test
  beforeEach(function(done){
    done();

  })

  // Drop database after each test
  afterEach(function(done){
    connection.db.dropDatabase(done);
  })

  // TESTS //

  describe('query() method', function(){

    it('should return empty array if no query', function(done){
      Lyric.query("", function(err, docs){
        docs.length.should.equal(0);
        done(err);
      })
    });

    it('should return the song i want', function(done){
      Lyric.query('fidelidad', function(err, docs){
        assert.equal(docs.length, 1);
        assert.equal(docs[0].id, '546d3e579a308c810513d648');
        done(err);
      })
    })

  })
})
