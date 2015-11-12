
const deploy = require('../index').deploy;

describe('deploy method', () => {
  it('returns a config and a task', () => {
    const result = deploy({
      bucketName: '-',
      accessKeyId: '-',
      secretAccessKey: '-',
    });
    expect(result).toEqual({
      config: jasmine.any(Object),
      task: jasmine.any(Function),
    });
  });

  describe('configuration', () => {
    it('has defaults', () => {
      const result = deploy({
        bucketName: '-',
        accessKeyId: '-',
        secretAccessKey: '-',
      });
      expect(result.config).toEqual({
        src: './dist/**/*.*',
        bucketName: '-',
        accessKeyId: '-',
        secretAccessKey: '-',
      });
    });

    it('throws errors when it contains falsy paths', () => {
      expect(() => {
        deploy({
          src: false,
          bucketName: '-',
          accessKeyId: '-',
          secretAccessKey: '-',
        });
      }).toThrow();
    });

    it('throws errors when it doesn\'t contain a bucket name', () => {
      expect(() => {
        deploy({
          src: '/',
          accessKeyId: '-',
          secretAccessKey: '-',
        });
      }).toThrow();
    });

    it('throws errors when it doesn\'t contain an access key ID', () => {
      expect(() => {
        deploy({
          src: '/',
          bucketName: '-',
          secretAccessKey: '-',
        });
      }).toThrow();
    });

    it('throws errors when it doesn\'t contain a secret access key', () => {
      expect(() => {
        deploy({
          src: '/',
          bucketName: '-',
          accessKeyId: '-',
        });
      }).toThrow();
    });
  });
});
