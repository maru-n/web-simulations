'use strict';

const gulp = require('gulp-help')(require('gulp'));
const browserify = require("browserify");
const babelify   = require("babelify");
const exorcist = require('exorcist');
const buffer = require('vinyl-buffer');
const source = require("vinyl-source-stream");
const uglifyes = require('uglify-es');
const composer = require('gulp-uglify/composer');
var minify = composer(uglifyes, console);


const targets = ['example', 'double_pendulum', 'scl']
const DIST_DIR = './dist/';

gulp.task('default', ['build:all']);

for (let i = 0; i < targets.length; i++) {
    let target = targets[i];
    let distdir = DIST_DIR + target;
    gulp.task('build:' + target, () => {
        gulp.src('public/index.html').pipe(gulp.dest(DIST_DIR));
        gulp.src(target + '/*.html').pipe(gulp.dest(distdir));

        let b = browserify({
            entries: target + '/main.js',
            debug: true
        })
        .transform(babelify);

        return b.bundle()
            .pipe(exorcist(distdir + '/main.js.map'))
            .pipe(source('main.js'))
            .pipe(gulp.dest(distdir));
    });

    gulp.task('build-release:' + target, () => {
        gulp.src('public/index.html').pipe(gulp.dest(DIST_DIR));
        gulp.src(target + '/*.html').pipe(gulp.dest(distdir));

        let b = browserify({
            entries: target + '/main.js'
        })
        .transform(babelify);

        return b.bundle()
            .pipe(source('main.js'))
            .pipe(buffer())
            .pipe(minify())
            .pipe(gulp.dest(distdir));
    });
}

gulp.task('build-release:all', targets.map((t)=>{return ('build-release:'+t)}));
gulp.task('build:all', targets.map((t)=>{return ('build:'+t)}));
