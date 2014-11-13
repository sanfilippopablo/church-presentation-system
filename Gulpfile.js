// Gulpfile.js
var gulp = require('gulp')
  , nodemon = require('gulp-nodemon')
  , jshint = require('gulp-jshint')

gulp.task('lint', function () {
	return
  gulp.src('./**/*.js')
    .pipe(jshint())
})

gulp.task('develop', function () {
  nodemon({ script: 'server/index.js', ext: 'js' })
    .on('change', ['lint'])
    .on('restart', function () {
      console.log('restarted!')
    })
})