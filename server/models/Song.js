module.exports = function (mongoose) {
  var Schema = mongoose.Schema;

  // Create Schema
  var songSchema = new Schema({
    title: String,
    creationDate: {type: Date, default: Date.now},
    verses: [{
      type: {type: String},
      lines: [String]
    }]
  });

  // Add indexes
  songSchema.index(
    {'verses.lines': 'text'},
    { 'default_language': 'spanish' }
  )

  // Static Methods
  songSchema.statics.query = function (str, cb) {
    return this.find({$text: {$search: str}}, cb);
  }

  // Instance Methods

  // Create model
  var Song = mongoose.model('Song', songSchema);
  return Song;
}
