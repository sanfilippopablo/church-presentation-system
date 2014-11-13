// Gulpfile.js
var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');

gulp.task('lint', function () {
	return
  gulp.src('./**/*.js')
    .pipe(jshint())
})

gulp.task('test', function () {
    return gulp.src('server/tests/*.js', {read: false})
        .pipe(mocha({reporter: 'spec'}));
});

gulp.task('develop', function () {
  nodemon({ script: 'server/index.js', ext: 'js' })
    .on('change', ['lint'])
    .on('restart', function () {
      console.log('restarted!')
    })
})
