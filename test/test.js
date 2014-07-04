'use strict';
var gulp   = require( 'gulp' )
var assert = require('assert');
var gutil  = require('gulp-util');
var haml   = require('../index.js');
var path  = require( 'path' );

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
    it( 'Input from file', function (done) {
        gulp
            .src(
                path.join( __dirname, 'input.haml' )
            )
            .pipe(
                haml()
            )
            .on( 'data', function( file ){
                assert.equal(
                    file.contents.toString( 'utf-8' ),
                    "<div class='class' id='id'>\r\n" +
                    "  <a href='#'>innerHTML</a>\r\n" +
                    "</div>\r\n",
                    'Input from file then check haml result'
                );
                done();
            } );
    } );
});
