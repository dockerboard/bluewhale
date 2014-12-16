'use strict';

var pkg = require('./package.json');
var glob = require('glob');
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();


/** Gulp dependencies */

var autoprefixer = plugins.autoprefixer;
var concat = plugins.concat;
var debug = plugins.debug;
var filter = plugins.filter;
var gif = plugins['if'];
var jade = plugins.jade;
var jscs = plugins.jscs;
var jshint = plugins.jshint;
var jshintSummary = require('jshint-summary');
var minifyCSS = plugins.minifyCss;
var ngAnnotate = plugins.ngAnnotate;
var ngHtml2js = plugins.ngHtml2js;
var sass = plugins.sass;
var uglify = plugins.uglify;
var watch = plugins.watch;


/** Tasks **/

gulp.task('default', ['build']);

gulp.task('build', ['build:scss', 'build:js', 'build:jade']);

gulp.task('watch', ['watch:scss', 'watch:js', 'watch:jade']);

/*** Scss Tasks ***/

gulp.task('build:scss', function () {
  return buildScss()
});

gulp.task('watch:scss', function (a) {
  return buildScss(true);
});

function buildScss(isWatching) {
  var dir = 'src/css/**/*.scss';
  var task = gulp.src(dir);
  if (isWatching) {
    task = task
      .pipe(watch(dir))
      .pipe(debug())
  }

  task
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'last 4 Android versions']
    }))
    .pipe(gif(!isWatching, minifyCSS()))
    .pipe(gulp.dest('dist/css'));

  return task;
}

/*** JS Tasks ***/

gulp.task('jshint', function () {
  return gulp.src('src/js/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter(
        jshintSummary, {
          fileColCol: ',bold',
          positionCol: ',bold',
          codeCol: 'green,bold',
          reasonCol: 'cyan'
        }
      ))
      .pipe(jshint.reporter('fail'));
});

gulp.task('jscs', function () {
  return gulp.src('src/js/**/*.js')
    .pipe(jscs());
});

gulp.task('build:js', function () {
  return buildJS();
});

gulp.task('watch:js', function () {
  return buildJS(true);
});

function buildJS(isWatching) {
  var dir = 'src/js/**/*.js';
  var task = gulp.src(dir);

  if (isWatching) {
    task = task
      .pipe(watch(dir))
      .pipe(debug());
  }

  task
    .pipe(ngAnnotate())
    .pipe(gif(!isWatching, uglify({ preserveComments: 'some' })))
    .pipe(gulp.dest('dist/js'));

  return task;
}

/*** Jade Tasks ***/
gulp.task('build:jade', function () {
  return buildJade()
});

gulp.task('watch:jade', function (a) {
  return buildJade(true);
});


/** Helpers **/

function buildJade(isWatching) {
  var htmlFilter = filter('**/*.html');
  var jadeFilter = filter('**/*.jade');
  //var tplJadeFilter = filter('**/*.tpl.jade');
  var dir = 'src/**/*.{html,jade}';
  var task = gulp.src(dir);

  if (isWatching) {
    task = task
      .pipe(watch(dir))
      .pipe(debug());
  }

  task
    .pipe(htmlFilter)
    .pipe(htmlFilter.restore())
    .pipe(jadeFilter)
    .pipe(jade({
      pretty: isWatching
    }))
    .pipe(jadeFilter.restore())
    .pipe(gulp.dest('dist/'));

  return task;
}
