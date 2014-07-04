# gulp-ziey-ruby-haml

This is a [gulp](http://gulpjs.com/) plugin that will use the `haml` command
line script to compile your Haml files into HTML. You need both Ruby and Haml
installed to use this. Try `gem install haml`. If you use
[Bundler](http://bundler.io/), add `gem 'haml'` to your Gemfile and run
`bundle install`.
## Update( 2014-07-04 )
There is an Push Request in Apr 23th in [gulp-ruby-haml](https://github.com/mongorian-chop/gulp-ruby-haml) 
and nither be accessed nor be close.

Well, let's change it to gulp-ziey-ruby-haml...

## Update( 2014-07-03 from [zemzheng](https://github.com/zemzheng) )
 
* Options

    Same as haml -h:

        -s, --stdin                      Read input from standard input instead of an input file
            --trace                      Show a full traceback on error
            --unix-newlines              Use Unix-style newlines in written files.
        -c, --check                      Just check syntax, don't evaluate.
        -t, --style NAME                 Output style. Can be indented (default) or ugly.
        -f, --format NAME                Output format. Can be html5 (default), xhtml, or html4.
        -e, --escape-html                Escape HTML characters (like ampersands and angle brackets) by default.
            --no-escape-attrs            Don't escape HTML characters (like ampersands and angle brackets) in attributes.
        -q, --double-quote-attributes    Set attribute wrapper to double-quotes (default is single).
            --cdata                      Always add CDATA sections to javascript and css blocks.
            --autoclose LIST             Comma separated list of elements to be automatically self-closed.
            --suppress-eval              Don't evaluate Ruby scripts.
        -r, --require FILE               Same as 'ruby -r'.
        -I, --load-path PATH             Same as 'ruby -I'.
        -E ex[:in]                       Specify the default external and internal character encodings.
        -d, --debug                      Print out the precompiled Ruby source.
        -p, --parse                      Print out Haml parse tree.
        -?, -h, --help                   Show this message
        -v, --version                    Print version

* Stream Accessable, so you can use:
    
        gulp.src( '*' )
            .pipe( other() )
            .pipe( haml() )            
            ...
        

## Options

Pass `{doubleQuote: true}` to use `"` around HTML attributes instead of `'`.
This uses the `-q`/`--double-quote-attributes` option with `haml`.

## gulpfile.js example
    
    var gulp = require('gulp');
    var watch = require('gulp-watch');
    var haml = require('gulp-ruby-haml');
    
    // Compile Haml into HTML
    gulp.task('haml', function() {
        gulp.src('./app/assets/haml/**/*.haml', {read: false}).
            pipe(haml()).
            pipe(gulp.dest('./public'));
    });
    
    // Compile Haml into HTML with double quotes around attributes
    // Same as haml -q
    gulp.task('haml-double-quote', function() {
        gulp.src('./app/assets/haml/**/*.haml', {read: false}).
            pipe(
                haml({
                    '-q' : true,
                    '--no-escape-attrs' : true
                })
            ).
            pipe(gulp.dest('./public'));
    });
    
    // Watch for changes in Haml files
    gulp.task('haml-watch', function() {
        gulp.src('./app/assets/haml/**/*.haml', {read: false}).
            pipe(watch()).
            pipe(haml()).
            pipe(gulp.dest('./public'));
    });


## Thanks

This largely came from [gulp-ruby-sass](https://github.com/sindresorhus/gulp-ruby-sass) by Sindre Sorhus.
