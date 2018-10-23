const mysql = require( 'mysql' );
module.exports = class Database {
    constructor() {
        this.connection = mysql.createConnection( {
            host     : '127.0.0.1',
            user     : 'root',
            password : 'password',
            database : 'PlagiarismDetection',
            timeout  : 18000000
        } );
    }
    query( sql, args ) {
        return new Promise( ( resolve, reject ) => {
            this.connection.query( sql, args, ( err, rows ) => {
                if ( err )
                    return reject( err );
                resolve( rows );
            } );
        } );
    }
    close() {
        return new Promise( ( resolve, reject ) => {
            this.connection.end( err => {
                if ( err )
                    return reject( err );
                resolve();
            } );
        } );
    }
};