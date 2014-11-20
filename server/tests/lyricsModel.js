var should = require('should');
var assert = require('assert');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var Lyric = require('../models/Lyric')(mongoose)

describe('Lyric model', function(){

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
