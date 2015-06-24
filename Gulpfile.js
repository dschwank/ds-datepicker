var gulp = require('gulp'),
    clean = require('gulp-clean'),
    gulpDocs = require('gulp-ngdocs'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    ngmin = require('gulp-ngmin'),
    concat = require('gulp-concat'),
    ngHtml2Js = require('gulp-ng-html2js'),
    minifyHtml = require('gulp-minify-html'),
    removeUseStrict = require('gulp-remove-use-strict');


var component = require('./bower.json');

var CONFIG = {
  DIST_PATH: 'dist/',
  DOCS_PATH: 'build/',
  SRC_PATH: 'src/',
  SCRIPT_PATH: 'src/scripts/',
  STYLES_PATH: 'src/styles/',
  TEMPLATES_PATH: 'src/templates/',
  IMAGES_PATH: 'src/images/'
};

/* #############
 * ### CLEAN ###
 * ############# */
gulp.task('clean', function() {
  return gulp.src(CONFIG.DIST_PATH, {read: false})
      .pipe(clean());
});

/* ############
 * ### DOCS ###
 * ############ */

gulp.task('build-docs', ['clean'], function() {
  var tOptions = {
    html5Mode: true,
    highlightCodeFences: true,
    startPage: '/api',
    title: 'dsDatepicker',
    titleLink: '/api'
  };

  return gulp.src([CONFIG.SCRIPT_PATH + '**/*.js', CONFIG.SCRIPT_PATH + '**/*.ngdoc'])
      .pipe(gulpDocs.process(tOptions))
      .pipe(gulp.dest(CONFIG.DOCS_PATH));

});

/* #############
 * ### BUILD ###
 * ############# */

gulp.task('build', ['build-assets', 'build-styles', 'build-scripts',
  'build-templates']);

gulp.task('build-assets', ['clean'], function() {
  return gulp.src(CONFIG.IMAGES_PATH + '**/*')
      .pipe(gulp.dest(CONFIG.DIST_PATH + 'images/'));
});

gulp.task('build-scripts', ['clean'], function() {

  return gulp.src([CONFIG.SCRIPT_PATH + 'app.js',
    CONFIG.SCRIPT_PATH + '**/*.js'])
      .pipe(ngmin())
      .pipe(concat(component.name + '.js'))
      .pipe(gulp.dest(CONFIG.DIST_PATH))
      .pipe(uglify())
      .pipe(removeUseStrict())
      .pipe(concat(component.name + '.min.js'))
      .pipe(gulp.dest(CONFIG.DIST_PATH));

});

gulp.task('build-styles', ['clean'], function() {

  return gulp.src(CONFIG.STYLES_PATH + '**/*.css')
      .pipe(concat('css/styles.css'))
      .pipe(gulp.dest(CONFIG.DIST_PATH))
      .pipe(minifyCss())
      .pipe(concat('css/styles.min.css'))
      .pipe(gulp.dest(CONFIG.DIST_PATH));

});

gulp.task('build-templates', ['clean'], function() {

  return gulp.src(CONFIG.TEMPLATES_PATH + '**/*.html')
      .pipe(minifyHtml({
        empty: true,
        spare: true,
        quotes: true
      }))
      .pipe(ngHtml2Js({
        moduleName: 'ds.templates',
        prefix: CONFIG.TEMPLATES_PATH
      }))
      .pipe(concat(component.name + '.templates.js'))
      .pipe(gulp.dest(CONFIG.DIST_PATH))
      .pipe(uglify())
      .pipe(concat(component.name + '.templates.min.js'))
      .pipe(gulp.dest(CONFIG.DIST_PATH));
});

/* ###############
 * ### DEFAULT ###
 * ############### */
gulp.task('default', ['clean', 'build', 'build-docs']);
