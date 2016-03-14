var gulp	= require('gulp'),
  concat	= require('gulp-concat'),
  es      = require('event-stream'),
  rem     = require('gulp-remove-code'),
  jsdoc   = require('gulp-jsdoc-to-markdown'),
  jshint  = require('gulp-jshint'),
  stylish = require('jshint-stylish'),
  less    = require('gulp-less'),
  wrap    = require('gulp-wrap'),
  async   = require('async'),
  conf    = require('./src/conf/gulp.js');

gulp.task('vendors', function(){
  var sources = [],
    maps = [],
    path = conf.vendors.src;
  if (!conf.vendors.sources.length) {
    return
  }
  console.info('Processing...');
  async.parallel({
    vendors: function(completed) {
      async.each(conf.vendors.sources, function(source, done) {
        console.info('\t...%s', source);
        sources.push(path + source);
        done();
      }, function(err){
        if (err) {
          console.error(err);
        } else {
          completed();
        }
      });
    },
    maps: function(completed) {
      async.each(conf.vendors.maps, function(map, done) {
        console.info('\t...%s', map);
        maps.push(path + map);
        done();
      }, function(err){
        if (err) {
          console.error(err);
        } else {
          completed();
        }
      });
    }
  }, function(err){
    if (err) {
      console.error(err);
    } else {
      console.info('...Finished.');
      return es.merge(
        gulp.src(sources).pipe(concat('vendors.js')),
        gulp.src(maps))
        .pipe(gulp.dest(conf.vendors.dist))
    }
  });


});

gulp.task('scripts', function(){
  return gulp.src(conf.scripts.sources)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(concat(conf.scripts.name))
    .pipe(rem({ production: true }))
    .pipe(wrap('(function(){\n\n<%= contents %>\n\n})();'))
    .pipe(gulp.dest(conf.scripts.dist));
});

gulp.task('assets', function(){
  return gulp.src(conf.assets.sources)
    .pipe(gulp.dest(conf.assets.dist));
});

gulp.task('styles', function(){
  return gulp.src(conf.styles.src)
    .pipe(less({paths: conf.styles.src}))
    .pipe(concat(conf.styles.name))
    .pipe(gulp.dest(conf.styles.dist));
});

gulp.task('templates', function(){
  return gulp.src(conf.templates.src)
    .pipe(gulp.dest(conf.templates.dist));
});

gulp.task('docs', function(){
  return gulp.src(conf.scripts.sources)
    .pipe(concat('README.md'))
    .pipe(jsdoc())
    .on('error', function(err) {
      console.log('jsdoc2md failed:', err.message);
    })
    .pipe(gulp.dest('./src/js'));
});

gulp.task('default', ['vendors', 'assets'], function(){
  gulp.watch(conf.templates.src, ['templates']);
  gulp.watch(conf.styles.src, ['styles']);
  gulp.watch([conf.scripts.src, '!gulpfile.js'], ['scripts']);
  gulp.watch([conf.scripts.src, '!gulpfile.js'], ['docs']);
  setTimeout(function() {
    console.info('Watching for changes...');
  },200);
});

gulp.task('dist', ['vendors', 'scripts', 'assets', 'styles', 'templates', 'docs']);
