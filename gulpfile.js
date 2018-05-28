const aws = require('aws-sdk');
const lambda = new aws.Lambda({apiVersion: '2015-03-31', region: 'us-west-2'});
const gulp = require('gulp');
const zip = require('gulp-zip');
const Transform = require('stream').Transform;
const fs = require('fs');
const exec = require('child_process').exec;

const config = JSON.parse(fs.readFileSync(__dirname + '/lambda.json'));

function update_lambda_code(upload){
    const stream = new Transform({objectMode: true});
    stream._transform = function(file, encoding, callback){
        let params = {
            FunctionName: config.FunctionArn,
            Publish: false,
            ZipFile: file.contents,
        };
        if(upload)
            params['DryRun'] = true;
        lambda.updateFunctionCode(params, function(err, data){
            console.log(data);
            callback(err, file);
        });
    };
    return stream;
}

gulp.task('default', function() {
    console.log("Run gulp pack or gulp upload");
});

gulp.task('pack', function() {
    exec('npm --prefix ./src install ./src');
    gulp.src(['function/*.js', 'function/**/*.*'])
        .pipe(zip(config.ZipName))
        .pipe(gulp.dest('dist'));
});

gulp.task('dryrun', ['pack'], function() {
    gulp.src(`dist/${config.ZipName}`)
        .pipe(update_lambda_code(false))
});

gulp.task('upload', ['pack'], function(cb) {
    gulp.src(`dist/${config.ZipName}`, {buffer: true})
        .pipe(update_lambda_code(true));
    cb();
});