var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');
const buffer = require("vinyl-buffer");
const browserSync = require("browser-sync").create();

const del = require("del");
const server = require("./server");

const PRODUCTION = process.env.NODE_ENV === "production ";
const config = {
    destDir: "./dest"
};

console.log(PRODUCTION);
function err(e) {
    console.error(e.toString());
    this.emit("end");
}


// Run server
gulp.task("server", PRODUCTION ? () => server(PRODUCTION) : function () {
    server();
    // only start browserSync when this is development
    browserSync.init({
        proxy: "localhost:3003",
        open: false,
        ghostMode: {
            clicks: true,
            forms: true,
            scroll: true
        },
        logPrefix: `${new Date().toString().split(" ")[4]} - CAN TEST`
    });
});


gulp.task("browserify", function () {
    const ops = {
        debug: !PRODUCTION,
        entries: "js/index.jsx",
        extensions: [".js", ".jsx"],
        basedir: "./src",
        transform: [babelify]
    };
    if (!PRODUCTION) {
        browserify(ops)
            .bundle()
            .on("error", err)
            .pipe(source("bundle.js"))
            .pipe(gulp.dest(config.destDir + "/js"))
            .pipe(browserSync.stream());
    }
    else {

        browserify(ops)
            .bundle()
            .on("error", err)
            .pipe(source("bundle.js"))
            .pipe(buffer())
            .pipe(uglify({ preserveComments: false, mangle: false }))
            .pipe(gulp.dest(config.destDir + "/js"));
    }
});

// Clean out Build directory
gulp.task("clean:build", function () {
    return del.sync(["./dist/**", "./build/**"]);
});


// Copy image files to Build directory
gulp.task("copy-img", function () {
    return gulp.src("./src/img/**/*")
        .pipe(gulp.dest(config.destDir + "/img"))
        .pipe(browserSync.stream());
    //.pipe(browserSync.stream());
});

// Copy CSS files to Build directory
gulp.task("copy-css", function () {
    return gulp.src("./src/css/**/*.css")
        .pipe(gulp.dest(config.destDir + "/css"))
        .pipe(browserSync.stream());
});

// Copy Index page to Build directory
gulp.task("copy-index", function () {
    gulp.src("./src/index.html")
        .pipe(gulp.dest(config.destDir))
        .pipe(browserSync.stream());
});

// Watch tasks
gulp.task("watch", ["build"], PRODUCTION ? () => { } : function () {
    gulp.watch(["./src/index.html"], ["copy-index"]);
    gulp.watch(["./src/css/**/*.css"], ["copy-css"]);
    gulp.watch(["./src/img/**/*"], ["copy-img"]);
    gulp.watch(["./src/js/**/*.js?(x)"], ["browserify"]);
});

// Build tasks
gulp.task("build", ["copy-img", "copy-index", "browserify"]);


// Default
gulp.task("default", [
    "clean:build",
    "watch",
    "server"
]);
