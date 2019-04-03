const gulp = require("gulp");
const less = require("gulp-less");

// CSS task
const css = () => {
  return gulp
    .src("./www/style/*.less")
    .pipe(less())
    .pipe(gulp.dest("./www/style"))
}

// Watch files
function watchFiles() {
  gulp.watch("./www/style/*.less", css);
}

const watch = gulp.parallel(watchFiles);

// Export Tasks
exports.css = css;
exports.watch = watch;
