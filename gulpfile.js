const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');

// مسارات الملفات
const paths = {
  scss: {
    src: 'src/**/*.scss',
    dest: 'dist/'
  },
  ts: {
    src: 'src/**/*.ts',
    dest: 'dist/'
  }
};

// مهمة تحويل SCSS
function compileScss() {
  return gulp.src(paths.scss.src)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.scss.dest));
}

// مهمة تحويل TypeScript
function compileTs() {
  const tsProject = ts.createProject('tsconfig.json');
  return gulp.src(paths.ts.src)
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.ts.dest));
}

// مراقبة التغييرات
function watchFiles() {
  gulp.watch(paths.scss.src, compileScss);
  gulp.watch(paths.ts.src, compileTs);
}

exports.scss = compileScss;
exports.ts = compileTs;
exports.default = gulp.series(compileScss, compileTs, watchFiles);
