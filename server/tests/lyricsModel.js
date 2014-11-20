var should = require('should');
var assert = require('assert');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var Lyric = require('../models/Lyric')(mongoose)

describe('Lyric model', function(){

  describe('query() method', function(){

    it('should return null if no query', function(done){
      Lyric.query("", function(err, docs){
        assert.equal(docs, null);
        done();
      })
    });
    
  })
})
