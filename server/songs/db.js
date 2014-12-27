var Datastore = require('nedb');
var _ = require('underscore');
var lunr = require('lunr');
require('../../node_modules/lunr-languages/lunr.stemmer.support.js')(lunr);
require('../../node_modules/lunr-languages/lunr.es.js')(lunr);
var conf = require('../config')[process.env.NODE_ENV];

// NeDB
db = new Datastore({
  filename: conf.dbPath('songs'),
  autoload: true
});

// lunr index
index = lunr(function() {
  this.use(lunr.es);
  this.pipeline.add(function(token, tokenIndex, tokens) {
    return token.replace(/[HhBbVvh]+/g, '')
  })
  this.field('title', {
    boost: 10
  })
  this.field('body')
  this.ref('_id')
});

// Initialize songs index with data
db.find({}, function(err, docs) {
  for (var i = 0; i < docs.length; i++) {
    var verses = _.map(docs[i].verses, function(verse) {
      return verse.lines.join('\n')
    });
    index.add({
      _id: docs[i]._id,
      title: docs[i].title,
      body: verses.join('\n')
    })
  }
})

module.exports.db = db;
module.exports.index = index;
