var eventEmitter = require('../events').eventEmitter;

var ExcecptionHandler = exports.ExcecptionHandler = function() {
    this.errors = {};
    process.on('uncaughtException', function(err) {    
        if (err.code == 'ECONNREFUSED') {
            // network error
            console.error('Uncaught Network ERROR: ', err.message);
        } else {
            console.error('Uncaught Unexpected ERROR: ', err.message);
        }
        process.exit(1);
    })
}

ExcecptionHandler.prototype.prototype = {};