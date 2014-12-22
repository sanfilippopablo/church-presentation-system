// Gulpfile.js
var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var jshint = require('gulp-jshint');
var mocha = require('gulp-spawn-mocha');
var karma = require('gulp-karma');

gulp.task('lint', function() {
  return
  gulp.src('./**/*.js')
    .pipe(jshint())
})

gulp.task('test-backend', function() {

	process.env.NODE_ENV = 'test'

  return gulp.src('server/tests/*.js', {
      read: false
    })
    .pipe(mocha({
      reporter: 'spec'
    }));
});

gulp.task('test-frontend', function() {
  // Be sure to return the stream
  return gulp.src('public/*/tests/*.js')
    .pipe(karma({
      configFile: 'karma.js',
      action: 'run'
    }))
    .on('error', function(err) {
      // Make sure failed tests cause gulp to exit non-zero
      throw err;
    });
});

gulp.task('test', ['test-backend', 'test-frontend'])

gulp.task('develop', function() {
  nodemon({
      script: 'server/index.js',
      watch: ['server', 'public'],
      ignore: ['.git/', 'node_modules'],
      env: { 'NODE_ENV': 'development' }
    })
    .on('change', ['lint'])
    .on('restart', function() {
      console.log('restarted!')
    })
})

gulp.task('default', ['test'])
