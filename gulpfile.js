// grab gulp packages
var gulp = require('gulp');

var plugins = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'gulp.*'],
  replaceString: /\bgulp[\-.]/
});

// create default task and add watch task to it
gulp.task('default', ['watch']);

// configure jshint task
gulp.task('jshint', function() {
    return gulp.src('source/javascript/**/*.js')
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('jshint-stylish'));
});

gulp.task('build-js', function() {
    return gulp.src('source/javascript/**/*.js')
        .pipe(plugins.sourcemaps.init())
        .pipe(concat('bundle.js'))
        // only uglify if gulp is ran with '--type production'
        .pipe(plugins.gutil.env.type === 'production' ? uglify() : gutil.noop())
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest('public/assets/javascript'));
});

gulp.task('build-css', function() {
    return gulp.src('source/less/**/*.less') // process original sources
        .pipe(plugins.less())
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest('public/assets/stylesheets'))
        .pipe(plugins.livereload()); // add the map to modified source
});

// configure which files to watch and what tasks to use on file changes
gulp.task('watch', function() {
    plugins.livereload.listen();
    gulp.watch('source/javascript/**/*.js', ['jshint']);
    gulp.watch('source/less/**/*.less', ['build-css']);
})
