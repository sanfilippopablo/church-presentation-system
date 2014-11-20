module.exports = function (mongoose) {
  var Schema = mongoose.Schema;

  var lyricSchema = new Schema({
    title: String,
    creationDate: {type: Date, default: Date.now},
    verses: [{
      type: {type: String},
      lines: [String]
    }]
  })

  lyricSchema.statics.query = function (str, cb) {
    this.find({$text: {$search: str}}, cb)
  }

  var Lyric = mongoose.model('Lyric', lyricSchema);
  return Lyric;
}
