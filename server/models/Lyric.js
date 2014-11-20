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

  var Lyric = mongoose.model('Lyric', lyricSchema);
  return Lyric;
}
