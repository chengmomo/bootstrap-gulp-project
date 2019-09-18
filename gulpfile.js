const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const header = require("gulp-header");
const rename = require("gulp-rename");
const sass = require("gulp-sass"); // 编译scss 为 css
const minifyCSS = require("gulp-minify-css");
const uglify = require("gulp-uglify");
const imagemin = require('gulp-imagemin'); //压缩图片
const cache = require('gulp-cache');
const mergeStream = require("merge-stream");
const notify = require('gulp-notify');

const del = require("del");
const pkg = require('./package.json');
const reload = browserSync.reload;

const banner = ['/**',
	' * <%= pkg.name %> - <%= pkg.description %>',
	' * @version v<%= pkg.version %>',
	' * @link <%= pkg.homepage %>',
	' * @license <%= pkg.license %>',
	' * @Copyright 2018 -<%= new Date().getFullYear() %> <%= pkg.author %>',
	' */',
	''
].join('\n');

// 静态服务器
function browser(done) {
	browserSync.init({
		//指定服务器启动目录
		server: {
			baseDir: "./",
			// proxy: "你的域名或IP" // 代理
		},
		port: 3000
	});
	done();
}
// BrowserSync reload
function browserSyncReload(done) {
	browserSync.reload();
	done();
}
// Clean vendor
function clean() {
	return del(["./dist/vendor/", "./dist/img/"]);
}

function modules() {
	// Font Awesome CSS
	var fontAwesomeCSS = gulp.src('./node_modules/font-awesome/css/**/*')
		.pipe(gulp.dest('./dist/vendor/font-awesome/css'));
	// Font Awesome Webfonts
	var fontAwesomeWebfonts = gulp.src('./node_modules/font-awesome/fonts/**/*')
		.pipe(gulp.dest('./dist/vendor/font-awesome/fonts'));
	// Bootstrap JS
	var bootstrap = gulp.src('./node_modules/bootstrap/dist/js/**/*')
		.pipe(gulp.dest('./dist/vendor/bootstrap/js'));
	// jQuery
	var jQuery = gulp.src([
			'./node_modules/jquery/dist/*',
			'!./node_modules/jquery/dist/core.js'
		])
		.pipe(gulp.dest('./dist/vendor/jquery'));
	// Owl Carousel
	var owlCarousel = gulp.src('./node_modules/owl-carousel/owl-carousel/*')
		  .pipe(gulp.dest('./dist/vendor/owl-carousel'));
	return mergeStream(fontAwesomeCSS, fontAwesomeWebfonts, bootstrap, jQuery, owlCarousel);
}

// CSS task: scss编译后的css将注入到浏览器里实现更新
// 以下划线开头命名的Sass文件叫做局部文件，编译时不会被单独编译成CSS文件，用来被其他的Sass文件引入
function css() {
	return gulp.src('./scss/**/*.scss')
		.pipe(sass({
			outputStyle: "expanded",
			includePaths: "./node_modules",
		})).on("error", sass.logError)
		.pipe(header(banner, {
			pkg: pkg
		}))
		.pipe(gulp.dest('./dist/css'))
		.pipe(rename({
			suffix: ".min"
		}))
		.pipe(minifyCSS())
		.pipe(gulp.dest("./dist/css"))
		.pipe(reload({
			stream: true
		})) //或.pipe(browserSync.stream())
		.pipe(notify({
			message: 'CSS task complete'
		}));
}
// JS task
function js() {
	return gulp
		.src([
			'./js/*.js',
			'!./js/*.min.js'
		])
		.pipe(header(banner, {
			pkg: pkg
		}))
		.pipe(uglify())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('./dist/js'))
		.pipe(browserSync.stream())
		.pipe(notify({
			message: 'Scripts task complete'
		}));
}

// images task
function images() {
	return gulp.src('./img/**/*')
		.pipe(cache(imagemin({
			optimizationLevel: 5, // 取值范围：0-7（优化等级），默认：3  
			progressive: true, // 无损压缩jpg图片，默认：false 
			interlaced: true, // 隔行扫描gif进行渲染，默认：false 
			multipass: true // 多次优化svg直到完全优化，默认：false 
		})))
		.pipe(gulp.dest('./dist/img'))
		.pipe(notify({
			message: 'Images task complete'
		}));
}

// Watch files
function watchFiles() {
	gulp.watch("./scss/**/*", css);
	gulp.watch(["./js/**/*", "!./js/**/*.min.js"], js);
	gulp.watch("./img/**/*", images);
	gulp.watch("./**/*.html", browserSyncReload);
}

const vendor = gulp.series(clean, modules);
const build = gulp.series(vendor, gulp.parallel(css, js, images));
const watch = gulp.series(build, gulp.parallel(watchFiles, browser));
exports.build = build;
exports.watch = watch;
exports.default = build;
