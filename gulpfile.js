// grab gulp packages
var gulp = require('gulp');

var plugins = require('gulp-load-plugins')();

var browserSync = require('browser-sync').create();

var bases = {
    source: 'source/',
    dist: 'dist/'
};

var paths = {
    scripts: ['scripts/**/*.js'],
    styles: ['styles/**/*.less'],
    css: ['styles/**/*.css'],
    html: ['*.html'],
    images: ['images/**/*.png', 'images/**/*.jpg'],
    extras: ['crossdomain.xml', 'humans.txt', 'manifest.appcache', 'robots.txt', 'favicon.ico'],
};

// create default task and add watch task to it
gulp.task('default', ['serve']);

// configure jshint task
gulp.task('jshint', function() {
    return gulp.src(paths.scripts, {
            cwd: bases.source
        })
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('jshint-stylish'));
});

// Delete the dist directory
gulp.task('clean', function() {
    return gulp.src(bases.dist)
        .pipe(plugins.clean());
});

// minify js and concatenate into one file
gulp.task('build-js', ['clean'], function() {
    return gulp.src(paths.scripts, {
            cwd: bases.source,
            base: bases.source + 'scripts/'
        }) // process original sources
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.concat('bundle.js'))
        // only uglify if gulp is ran with '--type production'
        .pipe(plugins.util.env.type === 'production' ? plugins.uglify() : plugins.util.noop())
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest(bases.dist + 'scripts/'))
        .pipe(browserSync.stream());
});

// compile less map to modified source
gulp.task('build-css', ['clean'], function() {
    return gulp.src(paths.styles, {
            cwd: bases.source,
            base: bases.source + 'styles/'
        }) // process original sources
        .pipe(plugins.less())
        .pipe(gulp.dest(bases.dist + 'styles/'))
        .pipe(browserSync.stream());
});

// Imagemin images and ouput them in dist
gulp.task('imagemin', ['clean'], function() {
    gulp.src(paths.images, {
            cwd: bases.source,
            base: bases.source + 'images/'
        })
        .pipe(plugins.imagemin())
        .pipe(gulp.dest(bases.dist + 'images/'))
        .pipe(browserSync.stream());
});

// copy html
gulp.task('copy-html', ['clean'], function() {
    return gulp.src(paths.html, {
            cwd: bases.source,
            base: bases.source
        })
        .pipe(gulp.dest(bases.dist))
        .pipe(browserSync.stream());
});

// build task
gulp.task('build', ['jshint', 'build-js', 'build-css', 'imagemin', 'copy-html']);

// configure which files to watch and what tasks to use on file changes
gulp.task('serve', ['build'], function(gulpCallback) {
    // static server
    browserSync.init({
        // server out of dist/
        server: bases.dist,
        open: false
    }, function callback() {
        // server is now up, watch files
        gulp.watch(bases.source + paths.scripts, ['jshint', 'build-js']);
        gulp.watch(bases.source + paths.styles, ['build-css']);
        gulp.watch(bases.source + paths.images, ['imagemin']);
        gulp.watch(bases.source + paths.html, ['copy-html']);
        gulpCallback();
    });
})
