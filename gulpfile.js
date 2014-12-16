'use strict';

var browserSync = require('browser-sync');
var del = require('del');
var glob = require('glob');
var gulp = require('gulp');
var pkg = require('./package.json');
var plugins = require('gulp-load-plugins')();

var AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

/** Gulp dependencies */

var autoprefixer = plugins.autoprefixer;
var concat = plugins.concat;
var csso = plugins.csso;
var debug = plugins.debug;
var filter = plugins.filter;
var gif = plugins['if'];
var jade = plugins.jade;
var jscs = plugins.jscs;
var jshint = plugins.jshint;
var jshintSummary = require('jshint-summary');
var ngAnnotate = plugins.ngAnnotate;
var ngHtml2js = plugins.ngHtml2js;
var sass = plugins.sass;
var uglify = plugins.uglify;
var watch = plugins.watch;


/** Tasks **/

gulp.task('default', ['clean'], function () {
  gulp.start('build');
});

gulp.task('build', ['build:scss', 'build:js', 'build:jade']);

gulp.task('watch', ['watch:scss', 'watch:js', 'watch:jade', 'browser-sync']);

gulp.task('clean', function(cb) {
  del(['dist/*'], { dot: true }, cb);
});

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      notify: false,
      logPrefix: 'BW',
      baseDir: './dist',
      routes: {
        "/bower_components": "bower_components"
      }
    }
  });
});

/*** Scss Tasks ***/

gulp.task('build:scss', function () {
  return buildScss()
});

gulp.task('watch:scss', function (a) {
  return buildScss(true)
    .pipe(browserSync.reload({ stream: true }));
});

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
  return buildJS(true)
    .pipe(browserSync.reload({ stream: true }));
});

/*** Jade Tasks ***/
gulp.task('build:jade', function () {
  return buildJade()
});

gulp.task('watch:jade', function (a) {
  return buildJade(true)
    .pipe(browserSync.reload({ stream: true }));
});


/** Helpers **/

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
      browsers: AUTOPREFIXER_BROWSERS
    }))
    .pipe(gif(!isWatching, csso()))
    .pipe(gulp.dest('dist/css'));

  return task;
}

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
