'use strict';

var pkg = require('./package.json');
var gulp = require('gulp');
var plugins = require('gulp-load-plugins');

/** Gulp dependencies */
var autoprefixer = plugins.autoprefixer;
var sass = plugins.sass;


gulp.task('default', ['build']);

gulp.task('build', ['build-scss', 'build-js']);

gulp.task('build-scss', function () {});

gulp.task('build-js', function () {
});
