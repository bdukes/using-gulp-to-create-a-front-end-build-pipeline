const gulp = require("gulp");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const imagemin = require("gulp-imagemin");
const sourcemaps = require("gulp-sourcemaps");
const rename = require("gulp-rename");

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

const defaultTask = gulp.parallel("js", "img");
defaultTask.displayName = "default";
defaultTask.description = "Process JS and image files";
gulp.task(defaultTask);
