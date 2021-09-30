
var eventEmitter = require('../events').eventEmitter;

var SessionWrapper = exports.SessionWrapper = function(sessionId) {
    this.sessionId = sessionId;
    this.tmpSession = null;     // unvisible to user; clear each time before return
}

SessionWrapper.prototype.prototype = {};

SessionWrapper.prototype.execute = function(stmt) {
    var that = this;
    eventEmitter.emit('getSessionById', that);

    if (typeof this.tmpSession === 'number') {
        console.log('SessionWrapper: [ERROR]: Problem occurred when fetching session.');
        return null;
    } else {
        var promise = new Promise((resolve, reject) => {
            this.tmpSession.execute(stmt)
            .then(function(result) {
                console.log(result)
                resolve(result);
            }, function() {
                reject(undefined);
            })
        })
        return promise;
    }
}

SessionWrapper.prototype.release = function() {
    var that = this;
    eventEmitter.emit('getSessionById', that);

    if (typeof this.tmpSession === 'number') {
        console.log('SessionWrapper: [ERROR]: Problem occurred when fetching session.');
        return null;
    } else {
        this.tmpSession.release();
    }
}

SessionWrapper.prototype.ping = function() {
    var that = this;
    eventEmitter.emit('getSessionById', that);

    if (typeof this.tmpSession === 'number') {
        console.log('SessionWrapper: [ERROR]: Problem occurred when fetching session.');
        return null;
    } else {
        var promise = new Promise((resolve, reject) => {
            this.ping()
            .then(function() {
                console.log('SessionWrapper: [INFO]: Ping successfully.');
                resolve();
            }, function() {
                console.log('SessionWrapper: [WARNING]: Ping failed. Please check it before making connections.');
                reject();
            })
        });
        return promise;
    }
}