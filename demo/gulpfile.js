/**
 * Demo Gulpfile
 *
 * You can refer to this Gulpfile to learn how to use this repo in your projects.
 * Feel free to copy and paste this file and customize it.
 */

const fs = require('fs');
const gulp = require('gulp');
const rimraf = require('rimraf');
const runSequence = require('run-sequence');

/**
 * Require the gulpTasks module with `require('gulp-tasks')` in your own project.
 */

const gulpTasks = require('../index');

/**
 * Server constants.
 */

const PORT = 8002;

/**
 * Source constants.
 */

const SOURCE_DIR = './src';
const ASSETS_SRC = [
  // UI Framework assets
  `${SOURCE_DIR}/assets/**/*`,
];
const STYLES_SRC = `${SOURCE_DIR}/**/*.scss`;
const TEMPLATES_SRC = `${SOURCE_DIR}/index.jade`;

/**
 * Distribution constants.
 */

const DISTRIBUTION_DIR = './dist';
const SCRIPTS_DST = `${DISTRIBUTION_DIR}/js`;
const STYLES_DST = `${DISTRIBUTION_DIR}/css`;

/**
 * Copy files.
 */

gulp.task('demoCopyAssets', gulpTasks.copy({
  src: ASSETS_SRC,
  dst: `${DISTRIBUTION_DIR}/assets`,
}).task);

/**
 * Compile JS.
 */

gulp.task('demoCompileJs', gulpTasks.compileJs({
  src: `${SOURCE_DIR}/index.js`,
  dst: SCRIPTS_DST,
  watch: false,
}).task);

gulp.task('demoCompileJsAndWatch', gulpTasks.compileJs({
  src: `${SOURCE_DIR}/index.js`,
  dst: SCRIPTS_DST,
  watch: true,
  hmrPort: 3000,
}).task);

/**
 * Minify JS.
 */

gulp.task('demoMinifyJs', gulpTasks.minifyJs({
  src: SCRIPTS_DST,
}).task);

/**
 * Compile CSS.
 */

gulp.task('demoCompileCss', gulpTasks.compileCss({
  src: STYLES_SRC,
  dst: STYLES_DST,
  compassImportPath: '../node_modules',
}).task);

/**
 * Minify CSS.
 */

gulp.task('demoMinifyCss', gulpTasks.minifyCss({
  src: STYLES_DST,
}).task);

/**
 * Compile HTML from Jade templates.
 */

gulp.task('demoCompileHtml', gulpTasks.compileHtml({
  src: TEMPLATES_SRC,
  dst: DISTRIBUTION_DIR,
}).task);

/**
 * Serve files to localhost.
 */

gulp.task('demoServe', gulpTasks.serve({
  root: DISTRIBUTION_DIR,
  fallback: `${DISTRIBUTION_DIR}/index.html`,
  port: PORT,
  livereload: true,
}).task);

/**
 * Lint as ES6.
 */

gulp.task('demoLintJs', gulpTasks.lintJs({
  src: `${SOURCE_DIR}/**/*.js`,
}).task);

/**
 * Lint SCSS.
 */

gulp.task('demoLintScss', gulpTasks.lintScss({
  file: './scss-config.yml',
  src: `${SOURCE_DIR}/**/*.scss`,
}).task);

/**
 *  Run unit tests.
 */

gulp.task('demoTestUnit', gulpTasks.testUnit({
  configFile: `${__dirname}/karma.conf.js`,
}).task);

/**
 *  Run e2e tests.
 */

const karmaPhantomJsShim =
  fs.readFileSync('../node_modules/karma-phantomjs-shim/shim.js');

gulp.task('demoTestE2e', gulpTasks.testE2e({
  dir: './tests-e2e',
  connect: {
    root: DISTRIBUTION_DIR,
    fallback: `${DISTRIBUTION_DIR}/index.html`,
    port: 9000,
  },
  shim: (`<script>${karmaPhantomJsShim}</script>`),
}).task);

/**
 * Deploy to AWS.
 */

gulp.task('demoDeploy', gulpTasks.deploy({
  // Deploys to http://gulp-tasks-test.smaatolabs.net/
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'No ENV',
  bucketName: 'smt-gulp-tasks-test',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'No ENV',
  src: `${DISTRIBUTION_DIR}/**/*.*`,
}).task);

gulp.task('demoDeployFolder', gulpTasks.deploy({
  // Deploys to http://gulp-tasks-test.smaatolabs.net/folder/index.html
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'No ENV',
  bucketName: 'smt-gulp-tasks-test',
  folder: 'folder',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'No ENV',
  src: `${DISTRIBUTION_DIR}/**/*.*`,
  sync: false,
}).task);

/**
 *  Compile everything.
 */

gulp.task('demoBuild', done => {
  runSequence(
    'demoCompileHtml',
    'demoCopyAssets',
    'demoCompileCss',
    'demoCompileJs',
    done
  );
});

/**
 *  Compile and test, e.g. called by pre-commit hook.
 */

gulp.task('demoTest', done => {
  runSequence(
    'demoLintJs',
    'demoLintScss',
    'demoBuild',
    'demoTestUnit',
    'demoTestE2e',
    done
  );
});

/**
 *  Compile everything and start watching for changes.
 */

gulp.task('demoWatch', [
  'demoServe',
  'demoCompileHtml',
  'demoCopyAssets',
  'demoCompileCss',
  'demoCompileJsAndWatch',
], () => {
  gulp.watch([TEMPLATES_SRC], ['demoCompileHtml']);
  gulp.watch([ASSETS_SRC], ['demoCopyAssets']);
  gulp.watch([STYLES_SRC], ['demoCompileCss']);
});

gulp.task('default', () => {
  // Clean, then start.
  rimraf(DISTRIBUTION_DIR, () => {
    gulp.start('demoWatch');
  });
});
