var gulp = require('gulp');
var sass = require('gulp-sass');

//
// TASKS
//

// SASS
gulp.task('sass', function(){
  return gulp.src('stylesheets/scss/*.scss')
    .pipe(sass()) // Using gulp-sass
    .pipe(gulp.dest('stylesheets/css'))
});









//
// WATCHERS
//

gulp.task('watch', ['sass'], function (){
  gulp.watch('stylesheets/scss/**/*.scss', ['sass']);
});

