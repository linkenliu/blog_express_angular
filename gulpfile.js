var gulp = require('gulp');

// 引入组件
var jshint = require('gulp-jshint');//js语法检查
var concat = require('gulp-concat');//文件合并
var uglify = require('gulp-uglify');//js压缩
var rename = require('gulp-rename');//文件重命名
var minifycss = require('gulp-minify-css');//css压缩
var babel = require('gulp-babel');


// 检查脚本
gulp.task('jshint', function() {
    gulp.src('./public/js/admin/vendor/admin-main-cover.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// 合并，压缩js文件
gulp.task('minify', function() {
    gulp.src('./public/js/admin/vendor/admin-main.js')
        .pipe(rename('admin-main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./public/js/admin/vendor'));
    gulp.src('./public/js/home/vendor/home-main.js')
        .pipe(rename('home-main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./public/js/home/vendor'));

});

// 合并，压缩css文件
gulp.task('mincss', function() {
    gulp.src('./public/css/home/home.css')
        .pipe(rename('home.min.css'))
        .pipe(minifycss())
        .pipe(gulp.dest('./public/css/home'));
});


gulp.task('babel', function(){
    return gulp.src('./public/js/admin/vendor/admin-main.js')
        .pipe(babel())
        .pipe(rename('admin-main-cover.js'))
        .pipe(gulp.dest('./public/js/admin/vendor'));
});


gulp.task('default', [ 'minify','mincss']);
