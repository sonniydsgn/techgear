
// Paths
let project_folder = require("path").basename(__dirname);
let source_folder = "#src";

let path = {
	build:{
		html: project_folder + "/",
		css: project_folder + "/css/",
		js: project_folder + "/js/",
		img: project_folder + "/images/"
	},
	src:{
		html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
		css: source_folder + "/scss/style.scss",
		js: source_folder + "/js/script.js",
		img: source_folder + "/images/**/*.+(png|jpg|gif|ico|svg|webp)"
	},
	watch:{
		html: source_folder + "/**/*.html",
		css: source_folder + "/scss/**/*.scss",
		js: source_folder + "/js/**/*.js",
		img: source_folder + "/images/**/*.+(png|jpg|gif|ico|svg|webp)"
	},
	clean: ["./" + project_folder + "/*.html", 
					"./" + project_folder + "/css/", 
					"./" + project_folder + "/js/", 
					"./" + project_folder + "/images/"]
}

// Variables
let {src, dest} = require("gulp"),
	gulp = require("gulp"),
	browsersync = require("browser-sync").create(),
	fileinclude = require("gulp-file-include"),
	del = require("del"),
	scss = require("gulp-sass"),
	rename = require("gulp-rename"),
	autoprefixer = require("gulp-autoprefixer"),
	cssbeautify = require("gulp-cssbeautify"),
	gcmq = require('gulp-group-css-media-queries'),
	cssnano = require("gulp-cssnano"),
	uglify = require("gulp-uglify-es").default,
	imagemin = require("gulp-imagemin");

// Reload Browser
function browserSync() {
	browsersync.init({
		server: {
			baseDir: "./" + project_folder + "/"
		},
		port: 3000,
		notify: false
	})
}

// HTML
function html() {
	return src(path.src.html)
		.pipe(fileinclude())
		.pipe(dest(path.build.html))
		.pipe(browsersync.stream())
}

// CSS
function css() {
	return src(path.src.css)
	// Full
		.pipe(scss())
		.pipe(autoprefixer({
			overrideBrowserslist: ['last 5 versions'],
			cascade: true
		}))
		.pipe(gcmq())
		.pipe(cssbeautify())
		.pipe(dest(path.build.css))
	// Compressed
		.pipe(cssnano({
			zindex: false,
			discardComments: {
					removeAll: true
			}
		}))
		.pipe(rename({suffix: '.min'}))
		.pipe(dest(path.build.css))
		.pipe(browsersync.stream())
}

function cssWatch(){
	return src(path.src.css)
		.pipe(scss())
		.pipe(cssnano({
			zindex: false,
			discardComments: {
					removeAll: true
			}
		}))
		.pipe(rename({suffix: '.min'}))
		.pipe(dest(path.build.css))
		.pipe(browsersync.stream())		
}

// Javascript
function js() {
	return src(path.src.js)
		.pipe(fileinclude())
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify())
		.pipe(dest(path.build.js))
		.pipe(browsersync.stream())
}

// Images
function images() {
	return src(path.src.img)
		.pipe(
			imagemin([
				imagemin.gifsicle({interlaced: true}),
				imagemin.mozjpeg({quality: 95, progressive: true}),
				imagemin.optipng({optimizationLevel: 5}),
				imagemin.svgo({
						plugins: [
								{ removeViewBox: true },
								{ cleanupIDs: false }
						]
				})
		]))
		.pipe(dest(path.build.img))
		.pipe(browsersync.stream())
}

// Watcher
function watchFiles() {
	gulp.watch([path.watch.html], html);
	gulp.watch([path.watch.css], cssWatch);
	gulp.watch([path.watch.js], js);
	gulp.watch([path.watch.img], images);
}

// Cleaner
function clean() {
	return del(path.clean);
}

// Exports
let build = gulp.series(clean, gulp.parallel(js, css, html, images));
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;