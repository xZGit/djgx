/**
 * Created by shandianhaizan on 16/7/5.
 */



var util = require( "util" );



exports.AppError = AppError;

exports.createAppError = createAppError;


function createAppError( settings ) {
    return( new AppError( settings, createAppError ) );

}



function AppError( settings, implementationContext ) {


    settings = ( settings || {} );

    this.name = "AppError";


    this.code = ( settings.code || 404 );
    this.message = ( settings.message || "An error occurred." );


    this.isAppError = true;

    Error.captureStackTrace( this, ( implementationContext || AppError ) );

}




util.inherits( AppError, Error );


