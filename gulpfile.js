var gulp = require('gulp');
var less = require('gulp-less');
//var path = require('path');

// TODO: add a default task, add a watch task, figure out how to make this more automatic.
//  see http://markgoodyear.com/2014/01/getting-started-with-gulp/

gulp.task('less', function() {
	gulp.src('./less/main.less')
		.pipe(less({
			//paths: [path.join(__dirname, 'less', 'includes')]
		}))
		.pipe(gulp.dest('./dist/css'));
});
