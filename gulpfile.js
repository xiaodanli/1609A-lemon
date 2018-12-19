var gulp = require('gulp');

var server = require('gulp-webserver');

var sass = require('gulp-sass');

//服务
gulp.task('server',function(){
    return gulp.src('src')
    .pipe(server({
        port:9090,
        proxies:[
            {
                source:'/classify/api/selectIcon',
                target:'http://localhost:3000/classify/api/selectIcon'
            },
			{
				source:'/users/api/addUser',
				target:'http://localhost:3000/users/api/addUser'
			},
			{
				source:'/classify/api/addClassify',
				target:'http://localhost:3000/classify/api/addClassify'
			},
			{
				source:'/classify/api/getClassify',
				target:'http://localhost:3000/classify/api/getClassify'
			},
			{
				source:'/bill/api/addBill',
				target:'http://localhost:3000/bill/api/addBill'
			},
			{
				source:'/bill/api/getBill',
				target:'http://localhost:3000/bill/api/getBill'
			},
			{
				source:'/bill/api/delBill',
				target:'http://localhost:3000/bill/api/delBill'
			},
			{
				source:'/bill/api/getClassify',
				target:'http://localhost:3000/bill/api/getClassify'
			}
        ]
    }))
})

gulp.task('sass',function(){
    return gulp.src('./src/scss/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./src/css'))
})

gulp.task('watch',function(){
    return gulp.watch('./src/scss/*.scss',gulp.series('sass'))
})

gulp.task('dev',gulp.series('sass','server','watch'))