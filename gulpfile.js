const fs = require("fs-extra");
const stringhash = require("string-hash");

const gulp = require("gulp");
const postcss = require("gulp-postcss");
const posthtml = require("gulp-posthtml");
const sass = require("gulp-sass");
const uglify = require("gulp-uglify-es").default;
const replace = require("gulp-replace");
const imagemin = require("gulp-imagemin");

const rev = require("gulp-rev");
const revFormat = require("gulp-rev-format");
const revRewrite = require("gulp-rev-rewrite");

const cssModules = require("postcss-modules");
const classtocssModule = require("posthtml-class-to-css-module");
const posthtmlCssModules = require("posthtml-css-modules");

const cssnano = require("cssnano");
const autoprefixer = require("autoprefixer");

sass.compiler = require("node-sass");

gulp.task("css", () => {
	fs.emptyDirSync("./dist");
	return gulp
		.src("./src/scss/index.scss")
		.pipe(sass().on("error", sass.logError))
		.pipe(
			postcss([
				cssModules({
					generateScopedName: function(name, filename, css) {
						if (name === "transition" || name.includes("icon-")) {
							return name;
						}
						const i = css.indexOf(`.${name}`);
						const lineNumber = css.substr(0, i).split(/[\r\n]/).length;
						const hash = stringhash(name)
							.toString(36)
							.substr(0, 5);

						return `_${hash}`;
					},
					getJSON: function(cssFileName, json, outputFileName) {
						var path = require("path");
						var cssName = path.basename(cssFileName, ".css");
						var jsonFileName = path.resolve("./dist/" + cssName + ".css.json");
						fs.writeFileSync(jsonFileName, JSON.stringify(json));
					},
				}),
				cssnano(),
				autoprefixer(),
			])
		)
		.pipe(rev())
		.pipe(revFormat({ prefix: "." }))
		.pipe(gulp.dest("./dist/css"))
		.pipe(
			rev.manifest({
				cwd: "./dist",
			})
		)
		.pipe(gulp.dest("./dist/css"));
});

gulp.task("html", () => {
	const manifest = gulp.src("./dist/rev-manifest.json");

	return gulp
		.src("./src/*.html")
		.pipe(
			posthtml([
				classtocssModule({
					removeClass: true,
				}),
				posthtmlCssModules("./dist/index.css.json"),
			])
		)
		.pipe(replace("global", "class"))
		.pipe(revRewrite({ manifest }))
		.pipe(gulp.dest("./dist"));
});

gulp.task("js", () => {
	return gulp
		.src("./src/js/*.js")
		.pipe(uglify())
		.pipe(rev())
		.pipe(revFormat({ prefix: "." }))
		.pipe(gulp.dest("./dist/js"))
		.pipe(
			rev.manifest({
				merge: true,
				cwd: "./dist",
			})
		)
		.pipe(gulp.dest("./dist"));
});

gulp.task("fonts", () => {
	return gulp.src("./src/fonts/**").pipe(gulp.dest("./dist/fonts"));
});

gulp.task("meta", () => {
	return gulp.src("./src/meta/**").pipe(gulp.dest("./dist/meta"));
});

gulp.task("img", () => {
	return gulp
		.src("./src/img/*")
		.pipe(imagemin())
		.pipe(gulp.dest("./dist/img"));
});

gulp.task("all", gulp.series("css", "js", "img", "fonts", "meta", "html"));
