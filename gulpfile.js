var lr = require('tiny-lr'), // Минивебсервер для livereload
	gulp = require('gulp'), // Сообственно Gulp JS
	jade = require('gulp-jade'), // Плагин для Jade
	stylus = require('gulp-stylus'), // Плагин для Stylus
	livereload = require('gulp-livereload'), // Livereload для Gulp
	csso = require('gulp-csso'), // Минификация CSS
	imagemin = require('gulp-imagemin'), // Минификация изображений
	uglify = require('gulp-uglify'), // Минификация JS
	concat = require('gulp-concat'), // Склейка файлов
	connect = require('connect'), // Webserver
    sourcemaps = require('gulp-sourcemaps'),
    replace = require('gulp-replace-task'),
	server = lr();

// Собираем Stylus
gulp.task('stylus', function() {
    gulp.src('./assets/stylus/screen.styl')
    .pipe(stylus()) // собираем stylus
    .on('error', console.log) // Если есть ошибки, выводим и продолжаем
    .pipe(csso()) // минифицируем
    .pipe(gulp.dest('./public/css/')) // записываем css
    .pipe(livereload(server)); // даем команду на перезагрузку css
});

// Собираем html из Jade
gulp.task('jade', function() {
    gulp.src(['./assets/templates/*.jade', '!./assets/templates/_*.jade'])
    .pipe(replace({
        patterns: [{
            match: '{{VERSION}}',
            replacement: +new Date()
        }]
    }))
    .pipe(jade())
	//.pipe(jade({pretty: true}))  // Собираем Jade только в папке ./assets/templates/ исключая файлы с _*
    .on('error', console.log) // Если есть ошибки, выводим и продолжаем
    .pipe(gulp.dest('./public/')) // Записываем собранные файлы
    .pipe(livereload(server)); // даем команду на перезагрузку страницы
});

gulp.task('libs', function() {
    gulp.src(['./assets/libs/**/*'])
    .pipe(gulp.dest('./public/libs/'));
});

// Собираем JS
gulp.task('js', function() {
    gulp.src([
        './assets/js/init.js'
    ])
    .pipe(replace({
        patterns: [{
            match: '{{VERSION}}',
            replacement: +new Date()
        }]
    }))
    .pipe(uglify())
    .pipe(gulp.dest('./public/js'));

    gulp.src([
    	'!./assets/js/init.js',
        './assets/js/app.js',
        './assets/js/**/*.js',
    ])
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(concat('main.min.js')) // Собираем все JS, кроме тех которые находятся в ./assets/js/libs/**, а так же, кроме init.js (т.к. он используется только на странице авторизации)
    .pipe(uglify()) // сжимаем всё, что есть
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./public/js'))
    .pipe(livereload(server)); // даем команду на перезагрузку страницы
});

// Копируем и минимизируем изображения
gulp.task('images', function() {
    gulp.src('./assets/img/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('./public/img'))
});

// Копируем шрифты
gulp.task('fonts', function() {
    gulp.src('./assets/fonts/**/*')
    .pipe(gulp.dest('./public/fonts'))
});

// Локальный сервер для разработки
gulp.task('http-server', function() {
    connect()
        .use(require('connect-livereload')())
        .use(connect.static('./public'))
        .listen('9000');

    console.log('Server listening on http://localhost:9000');
});

// Задача для разработки
// gulp watch
gulp.task('watch', function() {
    // Предварительно соберём релиз-версию проекта
    gulp.start('default');

    // Подключаем Livereload
    server.listen(35729, function(err) {
        if (err) return console.log(err);

        gulp.watch('assets/stylus/**/*.styl', ['stylus']);
        gulp.watch('assets/templates/**/*.jade', ['jade']);
        gulp.watch('assets/img/**/*', ['images']);
        gulp.watch('assets/js/**/*', ['js']);
        gulp.watch('assets/fonts/**/*', ['fonts']);
    });

    gulp.start('http-server');
});

//Задача для релиза
// gulp
gulp.task('default', function() {
    gulp.start('stylus'); // css
    gulp.start('jade'); // jade
    gulp.start('js'); // js
    gulp.start('libs');
    gulp.start('images'); // image
    gulp.start('fonts'); // fonts
});