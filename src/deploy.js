
const gulp = require('gulp');
const gulpAwspublish = require('gulp-awspublish');

module.exports = customConfig => {
  const config = Object.assign({
    src: './dist/**/*.*',
  }, customConfig);

  if (!config.src) {
    throw new Error('Invalid configuration: value of src needs to be a glob or an array of globs.');
  }

  if (!config.bucketName) {
    throw new Error('Invalid configuration: value of bucketName needs to be an AWS S3 bucket name.');
  }

  if (!config.accessKeyId) {
    throw new Error('Invalid configuration: value of accessKeyId needs to be a string.');
  }

  if (!config.secretAccessKey) {
    throw new Error('Invalid configuration: value of secretAccessKey needs to be a string.');
  }

  // Deploy to an AWS S3 bucket.
  function deploy() {
    const publisher = gulpAwspublish.create({
      params: {
        Bucket: config.bucketName,
      },
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    });
    return gulp.src(config.src)
      .pipe(publisher.publish())
      .pipe(publisher.sync())
      .pipe(gulpAwspublish.reporter());
  }

  return {
    task: deploy,
    config,
  };
};
