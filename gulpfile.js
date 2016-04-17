/*
Builds client JS and CSS
 */
'use strict'

const babel = require('gulp-babel'),
	cache = require('gulp-cached'),
	fs = require('fs-extra'),
	gulp = require('gulp'),
	gutil = require('gulp-util'),
	jsonminify = require('gulp-jsonminify'),
	less = require('gulp-less'),
	nano = require('gulp-cssnano'),
	rename = require('gulp-rename'),
	sourcemaps = require('gulp-sourcemaps'),
	ts = require('gulp-typescript'),
	uglify = require('gulp-uglify')

fs.mkdirsSync('./www/js/vendor')

// Keep script alive and rebuild on file changes
// Triggered with the `-w` flag
const watch = gutil.env.w

// Dependancy tasks for the default tasks
const tasks = []

// Client JS files
buildClient()

// Various little scripts
createTask('scripts', './clientScripts/*.js', src =>
	src
		.pipe(sourcemaps.init())
		.pipe(uglify())
		.on('error', handleError)
		.pipe(sourcemaps.write('./maps'))
		.pipe(gulp.dest('./www/js/scripts')))

// Compile Less to CSS
createTask('css', './less/*.less', src =>
	src
		.pipe(sourcemaps.init())
		.pipe(less())
		.on('error', handleError)
		.pipe(nano())
		.pipe(sourcemaps.write('./maps'))
		.pipe(gulp.dest('./www/css')))

// Language packs
createTask('lang', './lang/*.json', src =>
	src
		.pipe(jsonminify())
		.on('error', handleError)
		.pipe(gulp.dest('./www/lang')))

// Copies a dependancy libraries from node_modules to the vendor directory
tasks.push('vendor')
gulp.task('vendor', () => {
	const paths = [
		'./node_modules/systemjs/dist/system.js',
		'./node_modules/systemjs/dist/system.js.map',
		'./node_modules/dom4/build/dom4.js',
		'./node_modules/core-js/client/core.min.js',
		'./node_modules/core-js/client/core.min.js.map'
	]
	for (let path of paths) {
		const split = path.split('/'),
			dest = './www/js/vendor/' + split[split.length-1]
		fs.copySync(path, dest, {clobber: true})
	}
})

compileVendor('fetch', 'node_modules/whatwg-fetch/fetch.js')

// Client for legacy browsers. Must be run in a separate gulp invocation,
// because of typescript and babel constraints.
gulp.task("es5", () =>
	gulp.src('./client/**/*.ts')
		.pipe(sourcemaps.init())
		.pipe(ts(tsProject))
		.on('error', handleError)
		.pipe(babel({
			presets: ["babel-preset-es2015"]
		}))
		.pipe(uglify())
		.pipe(sourcemaps.write('./maps'))
		.pipe(gulp.dest('./www/js/es5')))

gulp.task('default', tasks)

const tsProject = ts.createProject('./client/tsconfig.json')

// Builds the client files of the apropriate ECMAScript version
function buildClient() {
	const name = 'client',
		path = './client/**/*.ts'
	tasks.push(name)
	gulp.task(name, () =>
		gulp.src(path)
			.pipe(sourcemaps.init())
			.pipe(ts(tsProject))
			.on('error', handleError)
			.pipe(sourcemaps.write('./maps'))
			.pipe(gulp.dest('./www/js/es6')))

	// Recompile on source update, if running with the `-w` flag
	if (watch) {
		gulp.watch(path, [name])
	}
}

// Simply log the error on continous builds, but fail the build and exit with
// an error status, if failing a one-time build. This way we can use failure to
// build the client to not pass Travis CL tests.
function handleError(err) {
	if (!watch) {
		throw err
	}
}

// Create a new gulp taks and set it to execute on default and incrementally
function createTask(name, path, task) {
	tasks.push(name)
	gulp.task(name, () =>
		task(gulp.src(path).pipe(cache(name))))

	// Recompile on source update, if running with the `-w` flag
	if (watch) {
		gulp.watch(path, [name])
	}
}

// Copy a dependancy library, minify and generate sourcemaps
function compileVendor(name, path) {
	createTask(name, path, src =>
		src
			.pipe(rename({basename: name}))
			.pipe(sourcemaps.init())
			.pipe(uglify())
			.pipe(sourcemaps.write('./maps'))
			.pipe(gulp.dest('./www/js/vendor')))
}
