'use strict';

/**
 *
 *
 * directions */

var resourcesSrc =      'src/',
    resourcesDist =      'dist/',
    dirImages_src =     resourcesSrc + 'images',
    dirImages_dist =    resourcesDist + 'images',
    dirCss_src =        resourcesSrc + 'styles',
    dirCss_dist =       resourcesDist + 'styles',
    npmDir =            'node_modules',
    dirFonts_dist =     resourcesDist + 'fonts',
    dirFonts_src =      resourcesSrc + 'fonts/*',
    dirJs_src =         resourcesSrc + 'scripts',
    dirJs_dist =        resourcesDist + 'scripts';



//подключаем плагины правильно
//вытягиваем необходимые скрипты из node_modules
var npmJsFiles = [
    npmDir + '/jquery/dist/jquery.js',
    npmDir + '/swiper/dist/js/swiper.jquery.js'
];

var npmCssFiles = [
    npmDir + '/font-awesome/css/font-awesome.css',
    npmDir + '/swiper/dist/css/swiper.css'
];

/**
 *
 *
 * requires */
var gulp =              require('gulp'),
    autoprefixer =      require('gulp-autoprefixer'),
    less =              require('gulp-less'),
    concat =            require('gulp-concat'),
    minifyJs =          require('gulp-uglify'),
    imagemin =          require('gulp-imagemin'),
    csso =              require('gulp-csso'),
    pump =              require('pump'),
    async =             require('async'),
    browserSync =       require('browser-sync').create(),
	nunjucksRender =    require('gulp-nunjucks-render'),
    reload =            browserSync.reload;

/**
 *
 *
 * tasks */

gulp.task('nunjucks-render', function () {
	return gulp.src('src/templates/*.html')
		.pipe(nunjucksRender({
			path: ['src/templates/'] // String or Array
		}))
		.pipe(gulp.dest(''));
});

gulp.task('less', ['vendor-css'], function (cb) {
    pump([
            gulp.src([dirCss_src + '/all.less']),
            less(),
            autoprefixer({
                browsers: ['last 7 versions'],
                cascade: true
            }),
            concat('stylesheet.css'),
            gulp.dest(dirCss_dist),
            csso(),
            concat('stylesheet.min.css'),
            gulp.dest(dirCss_dist)
        ],
        cb
    );
});

gulp.task('vendor-css', function (cb) {
    pump([
            gulp.src(npmCssFiles),
            concat('vendor.css'),
            csso(),
            concat('vendor.min.css'),
            gulp.dest(dirCss_dist)
        ],
        cb
    );
});

gulp.task('fonts', function (cb) {
    pump([
            gulp.src([dirFonts_src, npmDir + '/font-awesome/fonts/*']),
            gulp.dest(dirFonts_dist)
        ],
        cb
    );
});

gulp.task('image-min', function (cb) {
    pump([
            gulp.src(dirImages_src + '/**/*'),
            imagemin({
                progressive: true,
                svgoPlugins: [{removeViewBox: false}]
            }),
            gulp.dest(dirImages_dist)
        ],
        cb
    );
});

gulp.task('compress-js', function (cb) {
    pump([
            gulp.src(npmJsFiles.concat([dirJs_src + '/**/*.js'])),
            concat('scripts.js'),
            minifyJs({
                mangle: false
            }),
            gulp.dest(dirJs_dist)
        ],
        cb
    );
});


/**
 *
 *
 * Static server ↓ */

gulp.task('browser-sync', ['default'], function() {
    browserSync.init({
        server: {
            baseDir: '.'
        }
    });

    gulp.watch([dirCss_src + '/**/*.less'], ['less']).on('change', reload);
    gulp.watch([dirJs_src + '/*.js'], ['compress-js']).on('change', reload);
    gulp.watch([dirImages_src + '/**/*'], ['image-min']).on('change', reload);
    gulp.watch(['src/templates/*.html']).on('change', reload);
});

/**
 *
 *
 * big brother is watching this ↓ */

gulp.task('watch-default', ['default'], function () {
    gulp.watch([dirCss_src + '/**/*.less'], ['less']);
    gulp.watch([dirJs_src + '/*.js'], ['compress-js']);
    gulp.watch([dirImages_src + '/**/*'], ['image-min']);
	gulp.watch(['src/templates/**/*'],['nunjucks-render']);
});

/**
 *
 *
 * run all tasks for building */

gulp.task('default', ['fonts', 'less', 'compress-js', 'image-min', 'nunjucks-render']);
