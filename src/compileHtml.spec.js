
const gulp = require('gulp');
const runSequence = require('run-sequence');
const rimraf = require('rimraf');
const lstat = require('fs').lstat;
const compileHtml = require('../index').compileHtml;

describe('compileHtml method', () => {
  it('returns a config and a task', () => {
    const result = compileHtml();
    expect(result).toEqual({
      config: jasmine.any(Object),
      task: jasmine.any(Function),
    });
  });

  describe('configuration', () => {
    it('has defaults', () => {
      const result = compileHtml();
      expect(result.config).toEqual({
        src: './src/**/*.jade',
        dst: './dist',
      });
    });

    it('throws errors when it contains falsy paths', () => {
      expect(() => {
        compileHtml({
          dst: false,
        });
      }).toThrow();

      expect(() => {
        compileHtml({
          src: false,
        });
      }).toThrow();
    });
  });

  describe('gulp task', () => {
    beforeEach(done => {
      // rm -rf the dist folder.
      rimraf('./demo/dist', done);
    });

    it('compiles an HTML file', (done) => {
      gulp.task('testCompileHtml', compileHtml({
        src: './demo/src/index.jade',
        dst: './demo/dist',
      }).task);

      /**
       * Because the Gulp task is async, we need to use runSequence to execute
       * the task and then call the `done` async callback.
       */
      runSequence('testCompileHtml', () => {
        expect(gulp.tasks.testCompileHtml.done).toBe(true);
        lstat('./demo/dist/index.html', (err, stats) => {
          if (err) throw err;
          expect(stats.isFile()).toBe(true);
          done();
        });
      });
    });
  });
});
