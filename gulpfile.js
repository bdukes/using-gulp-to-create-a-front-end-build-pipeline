const gulp = require("gulp");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const eslint = require("gulp-eslint");
const less = require("gulp-less");
const sass = require("gulp-sass");
const stylus = require("gulp-stylus");
const postcss = require("gulp-postcss");
const cssnext = require("postcss-cssnext");
const autoprefixer = require("autoprefixer");
const cleanCss = require("gulp-clean-css");
const imagemin = require("gulp-imagemin");
const sourcemaps = require("gulp-sourcemaps");
const rename = require("gulp-rename");
const concat = require("gulp-concat");
const mergeStream = require("merge-stream");
const browserSync = require("browser-sync").create();

const basePath = "./Website/Portals/_default/Skins/Xcillion/";
const jsGlobs = [basePath + "**/*.js", "!" + basePath + "**/*.min.js"];
const imgGlobs = [
  basePath + "**/*.jpg",
  basePath + "**/*.png",
  basePath + "**/*.svg",
  basePath + "**/*.gif"
];
const lessGlobs = [basePath + "**/*.less"];
const sassGlobs = [basePath + "**/*.scss"];
const stylusGlobs = [basePath + "**/*.styl"];
const cssGlobs = [
  basePath + "**/*.css",
  "!" + basePath + "**/*.min.css",
  "!" + basePath + "skin.css"
];

function jsCompile() {
  return gulp
    .src(jsGlobs)
    .pipe(sourcemaps.init())
    .pipe(babel({ presets: ["env"] }))
    .pipe(uglify())
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(basePath));
}
jsCompile.description =
  "Transpile with Babel, minify with Uglify, add .min filename suffix, write sourcemaps";

function jsLint() {
  return gulp
    .src(jsGlobs)
    .pipe(eslint())
    .pipe(eslint.format());
  ////.pipe(eslint.failAfterError());
}
jsLint.description = "Lint JS for correctness issues";

const js = gulp.parallel(jsCompile, jsLint);
js.displayName = "js";
js.description = "Transpile and lint JS";
gulp.task(js);

function img() {
  return gulp
    .src(imgGlobs)
    .pipe(imagemin())
    .pipe(gulp.dest(basePath));
}
img.description = "Minify jpg, png, svg, and gif images";
gulp.task(img);

function css() {
  const lessStream = gulp
    .src(lessGlobs)
    .pipe(sourcemaps.init())
    .pipe(less());
  const sassStream = gulp
    .src(sassGlobs)
    .pipe(sourcemaps.init())
    .pipe(sass());
  const stylusStream = gulp
    .src(stylusGlobs)
    .pipe(sourcemaps.init())
    .pipe(stylus());
  const cssStream = gulp
    .src(cssGlobs)
    .pipe(sourcemaps.init())
    .pipe(postcss([cssnext()]));

  return mergeStream(lessStream, sassStream, stylusStream, cssStream)
    .pipe(concat("skin.css"))
    .pipe(postcss([autoprefixer()]))
    .pipe(cleanCss())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(basePath))
    .pipe(browserSync.stream({ match: "**/*.css" }));
}
css.description =
  "Compile all Less, Sass, Stylus into CSS, combine into one file, and minify";
gulp.task(css);

const defaultTask = gulp.parallel(js, css, img);
defaultTask.displayName = "default";
defaultTask.description = "Process JS, CSS, and image files";
gulp.task(defaultTask);

function reload(done) {
  browserSync.reload();
  done();
}

const jsWatch = () => gulp.watch(jsGlobs, gulp.series(js, reload));
const imgWatch = () => gulp.watch(imgGlobs, img);
const cssWatch = () =>
  gulp.watch(
    lessGlobs
      .concat(sassGlobs)
      .concat(stylusGlobs)
      .concat(cssGlobs),
    css
  );

function proxy(done) {
  browserSync.init({
    proxy: "gulp.local"
  });
  done();
}

const watch = gulp.parallel(proxy, jsWatch, imgWatch, cssWatch);
watch.displayName = "watch";
watch.description =
  "Watch for JS, CSS, and image changes, and start Browsersync";
gulp.task(watch);
