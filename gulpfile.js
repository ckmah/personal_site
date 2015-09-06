// grab gulp packages
var gulp = require('gulp');

var plugins = require('gulp-load-plugins')();

var bases = {
    source: 'source/',
    dist: 'dist/'
};

var paths = {
    scripts: ['scripts/**/*.js'],
    // libs: ['scripts/libs/jquery/dist/jquery.js', 'scripts/libs/underscore/underscore.js', 'scripts/backbone/backbone.js'],
    styles: ['styles/**/*.css'],
    html: ['index.html', '404.html'],
    images: ['images/**/*.png', 'images/**/*.jpg'],
    extras: ['crossdomain.xml', 'humans.txt', 'manifest.appcache', 'robots.txt', 'favicon.ico'],
};

// create default task and add watch task to it
gulp.task('default', ['watch']);

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
        .pipe(clean());
});

// minify js and concatenate into one file
gulp.task('build-js', ['clean'], function() {
    return gulp.src(paths.scripts, {
            cwd: bases.source
        }) // process original sources
        .pipe(plugins.sourcemaps.init())
        .pipe(concat('bundle.js'))
        // only uglify if gulp is ran with '--type production'
        .pipe(plugins.gutil.env.type === 'production' ? plugins.uglify() : gutil.noop())
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest(bases.dist + 'scripts/'))
        .pipe(plugins.livereload());
});

// compile less map to modified source
gulp.task('build-css', ['clean'], function() {
    return gulp.src(paths.styles, {
            cwd: bases.source
        }) // process original sources
        .pipe(plugins.less())
        .pipe(plugins.sourcemaps.write())
        .pipe((gulp.dest(bases.dist + 'styles/')))
        .pipe(plugins.livereload()); // add the map to modified source
});

// Imagemin images and ouput them in dist
gulp.task('imagemin', ['clean'], function() {
    gulp.src(paths.images, {
            cwd: bases.source
        })
        .pipe(imagemin())
        .pipe(gulp.dest(bases.dist + 'images/'));
});

// copy html
gulp.task('copy-html', ['clean'], function() {
    return gulp.src(paths.html, {
            cwd: bases.source
        })
        .pipe(gulp.dest(bases.dist));
});

// configure which files to watch and what tasks to use on file changes
gulp.task('watch', ['clean'], function() {
    plugins.livereload.listen();
    gulp.watch(bases.source + paths.scripts, ['jshint']);
    gulp.watch(bases.source + paths.styles, ['build-css']);
    gulp.watch(bases.source + paths.images, ['image-min']);
    gulp.watch(bases.source + paths.html, ['copy-html']);
})
