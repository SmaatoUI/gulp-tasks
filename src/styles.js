
/**
 * @description Style related tasks
 */

// Compass and PostCSS
module.exports.compassAndPostcss = function compassAndPostcss(src, dst) {
  var autoprefixer = require('autoprefixer');
  var cssMqpacker = require('css-mqpacker');
  var del = require('del');
  var gulp = require('gulp');
  var gulpCompass = require('gulp-compass');
  var gulpConnect = require('gulp-connect');
  var gulpPostcss = require('gulp-postcss');
  var gulpRename = require('gulp-rename');
  var gulpReplace = require('gulp-replace');
  var runSequence = require('run-sequence');

  var STYLES_DST = dst || './dist/css';
  var STYLES_SRC = src || [];

  gulp.task('compass', function compass() {
    return gulp.src(STYLES_SRC)
      .pipe(gulpCompass({
        css: STYLES_DST,
        import_path: './node_modules',
        sass: './app',
        sourcemap: true
      }))
      .on('error', function exitGulp() {
        throw new Error('Compass failed');
      })
      .pipe(gulp.dest(STYLES_DST));
  });

  gulp.task('postCss', function postCss() {
    return gulp.src((STYLES_DST + '/index.css'))
      .pipe(gulpPostcss([
        autoprefixer({
          browsers: ['last 2 versions']
        }),
        cssMqpacker
      ]))
      .pipe(gulp.dest(STYLES_DST));
  });

  gulp.task('renameDstIndexCss', function renameDstIndexCss() {
    return gulp.src((STYLES_DST + '/*'))
      // Replace occurences of index.css with dist.css inside of files
      .pipe(gulpReplace('index.css', 'dist.css'))
      // Rename files from *index*.* to *dist*.*
      .pipe(gulpRename(function rename(path) {
        path.basename = path.basename.replace('index', 'dist');
      }))
      .pipe(gulp.dest(STYLES_DST))
      .pipe(gulpConnect.reload());
  });

  gulp.task('deleteDstIndexCss', function deleteDstIndexCss() {
    return del([
      (STYLES_DST + '/index.css'),
      (STYLES_DST + '/index.css.map')
    ]);
  });

  gulp.task('styles', function styles(callback) {
    runSequence(
      'compass',
      'postCss',
      'renameDstIndexCss',
      'deleteDstIndexCss',
      callback
    );
  });
};

// clean-css
module.exports.cleanCss = function cleanCss(src) {
  var gulp = require('gulp');
  var gulpCssmin = require('gulp-cssmin');
  var gulpRename = require('gulp-rename');

  var STYLES_SRC = src || './dist/css';

  gulp.task('minifyStyles', function minifyStyles() {
    return gulp.src((STYLES_SRC + '/dist.css'))
      .pipe(gulpCssmin())
      .pipe(gulpRename('dist.min.css'))
      .pipe(gulp.dest(STYLES_SRC));
  });
};
