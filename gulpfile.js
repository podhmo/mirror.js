var gulp = require('gulp');
var concat = require('gulp-concat');
var espower = require("gulp-espower");
var mocha = require("gulp-mocha");
var paths = {
    test: "./test/*.js",
    powered_test: "./powered-test/test_builder.js",
    powered_test_dist: "./powered-test/"
};

gulp.task('default', function(){
  gulp.src(['./src/config.js', './src/renderer.js', './src/builder.js'])
    .pipe(concat('app.js'))
    .pipe(gulp.dest('./static/js'));
});

gulp.task('test', ["power-assert"], function(){
  gulp.src(paths.powered_test)
        .pipe(mocha());
});

gulp.task("power-assert", function () {
  return gulp.src(paths.test)
    .pipe(espower())
    .pipe(gulp.dest(paths.powered_test_dist));
});
