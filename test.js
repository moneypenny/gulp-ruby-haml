'use strict';
var assert = require('assert');
var gutil = require('gulp-util');
var haml = require('./index.js');

var newTest = function( desc, tips, input, output, options ){
    it( desc, function (done) {
        var myHaml = haml( options || {} );
        myHaml.once( 'data', function( file ){
            assert.equal(
                file.contents.toString( 'utf-8' ),
                output,
                tips
            );
            myHaml.end();
            done();
        } );
        myHaml.write(
            new gutil.File({
                contents : new Buffer( input )
            })
        );
    });
}

describe('compiles Haml into HTML', function() {
    newTest(
        'dom',
        'Haml was not compiled as expected',
        '%div abc',
        '<div>abc</div>\r\n'
    );
    newTest(
        'attr',
        'Haml was not compiled as expected',
        '%div( a=1 )',
        "<div a='1'></div>\r\n"
    );
    newTest(
        'double quot',
        'Haml was not compiled as expected',
        '%div( a=1 )',
        '<div a="1"></div>\r\n',
        { '-q' : true }
    );
    newTest(
        'double quot',
        'Haml was not compiled as expected',
        '%div( a="<a>" )',
        '<div a="&lt;a&gt;"></div>\r\n',
        { '-q' : true }
    );
    newTest(
        'double quot',
        'Haml was not compiled as expected',
        '%div( a="<a>" )',
        '<div a="<a>"></div>\r\n',
        { 
            '-q' : true,
            '--no-escape-attrs' : true 
        }
    );
});
