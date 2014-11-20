module.exports = function (mongoose) {
  var Schema = mongoose.Schema;

  // Create Schema
  var lyricSchema = new Schema({
    title: String,
    creationDate: {type: Date, default: Date.now},
    verses: [{
      type: {type: String},
      lines: [String]
    }]
  });

  // Add indexes
  lyricSchema.index(
    {'verses.lines': 'text'},
    { 'default_language': 'spanish' }
  )

  // Static Methods
  lyricSchema.statics.query = function (str, cb) {
    this.find({$text: {$search: str}}, cb)
  }

  // Instance Methods

  // Create model
  var Lyric = mongoose.model('Lyric', lyricSchema);
  return Lyric;
}
