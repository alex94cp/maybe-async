const del = require('del');
const gulp = require('gulp');
const merge = require('merge2');
const mocha = require('gulp-mocha');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const sourcemapsSupport = require('gulp-sourcemaps-support');

const tsProject = ts.createProject('tsconfig.json');

gulp.task('build', () => {
	const tsResult = tsProject.src()
	                          .pipe(sourcemaps.init())
	                          .pipe(tsProject());
	return merge([
		tsResult.dts.pipe(gulp.dest('dist')),
		tsResult.js.pipe(sourcemapsSupport())
		           .pipe(sourcemaps.write('.'))
		           .pipe(gulp.dest('dist')),
	]);
});

gulp.task('clean', () => {
	del('dist');
});

gulp.task('watch', () => {
	gulp.watch('src/**/*.ts', ['build']);
});

gulp.task('test', ['build'], () => {
	gulp.src('test/**/*.js')
	    .pipe(mocha());
});

gulp.task('default', ['build']);
