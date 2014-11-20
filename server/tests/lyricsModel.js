var should = require('should');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
var Lyric = require('../models/Lyric')(mongoose)
