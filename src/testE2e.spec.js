
const gulp = require('gulp');
const testE2e = require('../index').testE2e;

describe('testE2e method', () => {
  it('returns a config and a task', () => {
    const result = testE2e();
    expect(result).toEqual({
      config: jasmine.any(Object),
      task: jasmine.any(Function),
    });
  });

  describe('configuration', () => {
    it('has defaults', () => {
      const result = testE2e();
      expect(result.config).toEqual({
        subTaskPrefix: 'testE2e',
        dir: './e2e',
        src: '/src/**/*.js',
        dst: '/dist',
        connect: {
          root: './dist',
        },
        shim: false,
      });
    });

    it('throws errors when it contains falsy paths and objects', () => {
      expect(() => {
        testE2e({
          dir: false,
        });
      }).toThrow();

      expect(() => {
        testE2e({
          src: false,
        });
      }).toThrow();

      expect(() => {
        testE2e({
          dst: false,
        });
      }).toThrow();

      expect(() => {
        testE2e({
          connect: false,
        });
      }).toThrow();
    });
  });

  describe('internals', () => {
    it('registers 7 sub-tasks', () => {
      testE2e({
        subTaskPrefix: 'testE2eInternals',
      });
      expect(gulp.tasks['testE2eInternals:startServer']).toBeDefined();
      expect(gulp.tasks['testE2eInternals:cleanDist']).toBeDefined();
      expect(gulp.tasks['testE2eInternals:compileTests']).toBeDefined();
      expect(gulp.tasks['testE2eInternals:shimKarma']).toBeDefined();
      expect(gulp.tasks['testE2eInternals:runTests']).toBeDefined();
      expect(gulp.tasks['testE2eInternals:unshimKarma']).toBeDefined();
      expect(gulp.tasks['testE2eInternals:stopServer']).toBeDefined();
    });
  });
});
