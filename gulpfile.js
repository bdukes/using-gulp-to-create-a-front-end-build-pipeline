const gulp = require("gulp");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
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

const basePath = "./Website/Portals/_default/Skins/Xcillion/";
function js() {
  return gulp
    .src([basePath + "**/*.js", "!" + basePath + "**/*.min.js"])
    .pipe(sourcemaps.init())
    .pipe(babel({ presets: ["env"] }))
    .pipe(uglify())
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(basePath));
}
js.description =
  "Transpile with Babel, minify with Uglify, add .min filename suffix, write sourcemaps";
gulp.task(js);

function img() {
  return gulp
    .src([
      basePath + "**/*.jpg",
      basePath + "**/*.png",
      basePath + "**/*.svg",
      basePath + "**/*.gif"
    ])
    .pipe(imagemin())
    .pipe(gulp.dest(basePath));
}
img.description = "Minify jpg, png, svg, and gif images";
gulp.task(img);

function css() {
  const lessStream = gulp
    .src(basePath + "**/*.less")
    .pipe(sourcemaps.init())
    .pipe(less());
  const sassStream = gulp
    .src(basePath + "**/*.scss")
    .pipe(sourcemaps.init())
    .pipe(sass());
  const stylusStream = gulp
    .src(basePath + "**/*.styl")
    .pipe(sourcemaps.init())
    .pipe(stylus());
  const cssStream = gulp
    .src([
      basePath + "**/*.css",
      "!" + basePath + "**/*.min.css",
      "!" + basePath + "skin.css"
    ])
    .pipe(sourcemaps.init())
    .pipe(postcss([cssnext()]));

  return mergeStream(lessStream, sassStream, stylusStream, cssStream)
    .pipe(concat("skin.css"))
    .pipe(postcss([autoprefixer()]))
    .pipe(cleanCss())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(basePath));
}
css.description =
  "Compile all Less, Sass, Stylus into CSS, combine into one file, and minify";
gulp.task(css);

const defaultTask = gulp.parallel("js", "css", "img");
defaultTask.displayName = "default";
defaultTask.description = "Process JS, CSS, and image files";
gulp.task(defaultTask);
