const gulp = require('gulp');
const eslint = require('gulp-eslint');

const inputPaths = {
    javascript: [
        '*.js',
        'scripts/*.js',
    ],
};

gulp.task('js:lint', () => {
    // http://eslint.org/docs/rules
    let task = gulp
        .src(inputPaths.javascript)
        .pipe(eslint())
        .pipe(eslint.format());

    if (process.env.CI) {
        task = task.pipe(eslint.failAfterError());
    }

    return task;
});

gulp.task('js:watch', () => {
    gulp.watch(inputPaths.javascript, ['js:lint']);
});

gulp.task('default', ['js:watch']);
