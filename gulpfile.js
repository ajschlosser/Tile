var gulp = require('gulp'),
	concat = require('gulp-concat'),
	es = require('event-stream'),
	jshint = require('gulp-jshint'),
	stylish = require('jshint-stylish'),
	less = require('gulp-less'),
	async = require('async'),
	conf = require('./src/conf.d/gulp.js');

gulp.task('vendors', function(){
	var sources = [],
		maps = [],
		path = conf.paths.vendors.src;
	if (!conf.paths.vendors.sources.length) {
		return
	}
	console.info('Processing...');
	async.parallel({
		vendors: function(completed) {
			async.each(conf.paths.vendors.sources, function(source, done) {
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
			async.each(conf.paths.vendors.maps, function(map, done) {
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
				.pipe(gulp.dest(conf.paths.vendors.dist))
		}
	});


});

gulp.task('scripts', function(){
	return gulp.src(conf.paths.scripts.src)
		.pipe(jshint())
		.pipe(jshint.reporter(stylish))
		.pipe(concat('game.js'))
		.pipe(gulp.dest(conf.paths.scripts.dist));
});

gulp.task('styles', function(){
	return gulp.src(conf.paths.styles.src)
		.pipe(less({paths: conf.paths.styles.src}))
		.pipe(concat('app.css'))
		.pipe(gulp.dest(conf.paths.styles.dist));
});

gulp.task('templates', function(){
	return gulp.src(conf.paths.templates.src)
		.pipe(gulp.dest(conf.paths.templates.dist));
});

gulp.task('default', ['vendors'], function(){
	gulp.watch(conf.paths.templates.src, ['templates']);
	gulp.watch(conf.paths.styles.src, ['styles']);
	gulp.watch([conf.paths.scripts.src, '!gulpfile.js'], ['scripts']);
	setTimeout(function() {
		console.info('Watching for changes...');
	},200);
});