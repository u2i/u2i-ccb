var gulp = require('gulp');
var mocha = require('gulp-mocha');
// --- Basic Tasks ---
gulp.task('test', function() {
  return gulp.src('test/**/*.js', {
      read: false
    })
    .pipe(mocha({
      reporter: 'spec' //or nyan :)
    }))
    .once('end', function() {
      process.exit();
    });
});

// Default Task
gulp.task('default', ['test']);
