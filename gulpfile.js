const del = require('del');
const gulp = require('gulp');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');

const tsProject = ts.createProject('tsconfig.json');

gulp.task('build', () => {
	return tsProject.src()
	                .pipe(sourcemaps.init())
	                .pipe(tsProject())
	                .pipe(sourcemaps.write('.'))
	                .pipe(gulp.dest('dist'));
});

gulp.task('clean', () => {
	del('dist');
});

gulp.task('watch', () => {
	gulp.watch('src/**/*.ts', ['build']);
});

gulp.task('default', ['build']);
