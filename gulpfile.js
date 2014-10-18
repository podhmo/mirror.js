var gulp = require('gulp');
var concat = require('gulp-concat');
var mocha = require('gulp-mocha');

gulp.task('default', function(){
  gulp.src('./src/*.js')
    .pipe(concat('app.js'))
    .pipe(gulp.dest('./static/js'));
});

gulp.task('test', function(){
  gulp.src(['head.js', 'src/*.js', 'test/*.js'])
    .pipe(mocha({reporter: 'spec'}));
});
