var spawn       = require('win-spawn');
var gutil       = require('gulp-util');
var Buffer      = require('buffer').Buffer;
var PluginError = gutil.PluginError;
var through     = require('through2');
var os          = require( 'os' );
var fs          = require( 'fs' );
var path        = require( 'path' );

const PLUGIN_NAME = 'gulp-ruby-haml';

var haml = function( args, file, self, callback ){
    gutil.log(
        'Haml Input',
        gutil.colors.yellow( file.path || file.contents.toString() )
    );
    var cp = spawn( 'haml ' + args.join( ' ' ) );
    var tmp_file_path = args[ args.length -1 ];

    cp.on('error', function (err) {
        self.emit('error', new PluginError(PLUGIN_NAME, err));
        return callback(null, file);
    });

    var haml_data = '';
    var errors = '';

    cp.stderr.setEncoding('utf8');
    cp.stdout.setEncoding('utf8');

    cp.stdout.on('data', function (data) { haml_data += data.toString(); });
    cp.stderr.on('data', function (data) {
        var str = data.toString()
        gutil.log(
            gutil.colors.bgRed( 'Haml Error' ),
            JSON.stringify( args )
        );
        gutil.log(
            gutil.colors.bgRed( str )
        );
        errors += str; 
    });

    cp.on('close', function (code) {
        if (errors) {
            self.emit('error', new PluginError(PLUGIN_NAME, errors));
            return callback(null, null);
        }
        fs.unlink( tmp_file_path );

        if (code > 0) {
            self.emit(
                'error', 
                new PluginError(PLUGIN_NAME, 'Exited with error code ' + code)
            );
            return callback(null, null);
        }

        file.contents = new Buffer(haml_data);
        return callback(null, file);
    });
};

var makeArgsByOptions = function( options ){
    var key, val, result = [];
    for( key in options ){
        val = options[ key ];
        if( false === val ){ 
            continue 
        } else if( true === val ){
            val = undefined;
        }
        result.push( key, val )
    }
    return result;
}
var extend = function( obj1, obj2 ){
    var key;
    for( key in obj2 ){
        obj1[ key ] = obj2[ key ];
    }
    return obj1;
}
module.exports = function( options ) {
    function modifyFile(file, enc, callback) {
        if (file.isNull()) { return callback(null, file); }

        if (file.isStream()) {
            this.emit(
                'error',
                new PluginError(PLUGIN_NAME, 'Streaming not supported')
            );
            return callback(null, file);
        }

        var args = makeArgsByOptions( extend(
                { '-E' : 'utf-8' },
                options || {}
            ) );

        
        var self = this;
    
        if( file.contents ){
            var file_path = path.join(
                os.tmpdir(), path.basename( file.path ) + ( +new Date )
            );
            args.push( file_path );
            fs.writeFile( file_path, file.contents.toString( 'utf8' ), function( err ){
                if( err ){
                    self.emit( 'error', err );
                    return callback( null, file );
                }
                haml( args, file, self, callback );
            } );
            
        } else if( file.path ){
            args.push( file.path );
            haml( args, file, self, callback );
        }

        
    }

    return through.obj(modifyFile);
};
