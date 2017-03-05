/**
 * gulpfile.js
 * @type {[type]}
 * @DateTime 2017-03-05T15:37:31+0800
 * @author  kingcc <laikinfox@gmail.com>
 */

var gulp = require('gulp'),
    os = require('os'),
    sass = require('gulp-sass'),
    gutil = require('gulp-util'),
    concat = require('gulp-concat'),
    gulpOpen = require('gulp-open'),
    uglify = require('gulp-uglify'),
    md5 = require('gulp-md5-plus'),
    fileinclude = require('gulp-file-include'),
    clean = require('gulp-clean'),
    cssMin = require('gulp-cssmin'),
    spriter = require('gulp-css-spriter'),
    base64 = require('gulp-css-base64'),
    webpack = require('webpack'),
    webpackConfig = require('./webpack.config.js'),
    connect = require('gulp-connect'),
    htmlmin = require('gulp-htmlmin'),
    jade = require('gulp-jade'),
    browserSync = require('browser-sync').create();

var host = {
    path: 'dist/',
    port: 3000,
    html: 'index.html'
};

var browser = os.platform() === 'linux' ? 'chromium-browser' : (
  os.platform() === 'darwin' ? 'Google chrome' : (
  os.platform() === 'win32' ? 'chrome' : 'firefox'));
var pkg = require('./package.json');

gulp.task('copy:img', function (done) {
    gulp.src(['src/css/img/**/*']).pipe(gulp.dest('dist/css/img')).on('end', done);
});

gulp.task('copy:fonts' , function (done) {
    gulp.src(['src/css/fonts/**/*']).pipe(gulp.dest('dist/css/fonts')).on('end', done);
});


gulp.task('cssmin', function (done) {
    gulp.src(['src/css/*.scss', 'src/css/*.css'])
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('style.min.css'))
        .pipe(gulp.dest('./dist/css/'))
        .on('end', done);
});

//将js加上10位md5,并修改html中的引用路径，该动作依赖build-js
gulp.task('md5:js', ['build-js'], function (done) {
    gulp.src('dist/js/*.js')
        .pipe(md5(10, 'dist/app/*.html'))
        .pipe(gulp.dest('dist/js'))
        .on('end', done);
});

//将css加上10位md5，并修改html中的引用路径，该动作依赖sprite
gulp.task('md5:css', ['sprite'], function (done) {
    gulp.src('dist/css/*.css')
        .pipe(md5(10, 'dist/app/*.html'))
        .pipe(gulp.dest('dist/css'))
        .on('end', done);
});

//用于在html文件中直接include文件
gulp.task('fileinclude', ['parseJade'] , function (done) {
    gulp.src(['src/app/*.html'])
        .pipe(fileinclude({
          prefix: '@@',
          basepath: '@file'
        }))
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('dist/app'))
        .on('end', done);
        // .pipe(connect.reload())
});

gulp.task('parseJade', function (done) {
    gulp.src('src/app/*.jade')
        .pipe(jade({
          locals: {} //YOUR_LOCALS
        }))
        .pipe(gulp.dest('src/app/'))
        .on('end', done);
});

//雪碧图操作，应该先拷贝图片并压缩合并css
gulp.task('sprite', ['copy:img', 'cssmin'], function (done) {
    var timestamp = +new Date();
    gulp.src('dist/css/style.min.css')
        .pipe(spriter({
            spriteSheet: 'dist/css/img/spritesheet' + timestamp + '.png',
            pathToSpriteSheetFromCSS: './img/spritesheet' + timestamp + '.png',
            spritesmithOptions: {
                padding: 10
            }
        }))
        .pipe(base64())
        .pipe(cssMin())
        .pipe(gulp.dest('dist/css'))
        .on('end', done);
});

gulp.task('clean-dist', function () {
    return gulp.src('dist/', {read: false})
        .pipe(clean());
});

gulp.task('watch', function (done) {
    gulp.watch('src/**/*', ['cssmin', 'build-js', 'fileinclude'])
        .on('end', done);
});

gulp.task('connect', function () {
    console.log('connect------------');
    connect.server({
        root: host.path,
        port: host.port,
        livereload: true
    });
});

gulp.task('open', function (done) {
    browserSync.init({
         files:[             
            'dist/'
         ],
         logLevel: "debug",
         logPrefix:"insgeek",
         proxy:"localhost:3000",
         ghostMode: {
            clicks: true,
            forms: true,
            scroll: true
         },
         port: 4000,
         browser: browser
    });
});

var myDevConfig = Object.create(webpackConfig);

var devCompiler = webpack(myDevConfig);

//引用webpack对js进行操作
gulp.task("build-js", ['fileinclude'], function(callback) {
    devCompiler.run(function(err, stats) {
        if(err) throw new gutil.PluginError("webpack:build-js", err);
        gutil.log("[webpack:build-js]", stats.toString({
            colors: true
        }));
        callback();
    });
});

gulp.task('deploy', ['connect', 'fileinclude', 'md5:css', 'md5:js']);

gulp.task('dev', ['connect', 'copy:img', 'copy:fonts', 'fileinclude', 'cssmin', 'build-js', 'watch', 'open']);

gulp.task('default', ['clean-dist']);