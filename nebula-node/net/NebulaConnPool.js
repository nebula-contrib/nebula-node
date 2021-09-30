/* Copyright (c) 2020 vesoft inc. All rights reserved.
 *
 * This source code is licensed under Apache 2.0 License,
 * attached with Common Clause Condition 1.0, found in the LICENSES directory.
 */

var NebulaConn = require('./Connection').Connection;
var SessionRecorder = require('./SessionRecorder').SessionRecorder;
var SessionWrapper = require('./SessionWrapper').SessionWrapper;
var LoadBalancer = require('./LoadBalancer').LoadBalancer;
var ExceptionHandler = require('./ExceptionHandler').ExcecptionHandler;
var eventEmitter = require('../events').eventEmitter;

var NebulaConnPool = exports.NebulaConnPool = function() {
    this.connections = {};
    this.sessionRecorder = new SessionRecorder();
    this.loadBalancer = new LoadBalancer();
    this.exceptionHandler = new ExceptionHandler();
}

NebulaConnPool.prototype.prototype = {};

NebulaConnPool.prototype.init = function(configs) {
    this.configs = configs;

    var that = this;

    eventEmitter.on('addAddress', function(address) {
        that.configs.addresses.push(address);
    });

    eventEmitter.on('delAddress', function(delIndex) {
        that.configs.addresses.splice(delIndex, 1);
    });

    eventEmitter.on('setConnFree', function(sttime, sessionId) {
        that.connections[sttime].signout(sessionId);
        that.connections[sttime].status = 'free';
        console.log('ConnPool: [INFO]: Set connection: ' + sttime + ' status free.');
    });
}

NebulaConnPool.prototype.close = function() {
    eventEmitter.emit('connPoolClose');
    for (var id in this.connections) {
        this.connections[id].close();
        delete this.connections[id];
        console.log('ConnPool: [INFO]: Close Connection: ' + id);
    }
    eventEmitter.removeAllListeners();
}

NebulaConnPool.prototype.startConn = function(host, port, timeout) {
    if (this.configs === undefined) {
        throw 'Parameters are not configured.';
    } else if (Object.keys(this.connections).length < this.configs.maxConnectionPoolSize) {
        var timestamp = new Date().getTime();
        var newConn = new NebulaConn(host, port, timeout, timestamp);
        try {
            newConn.open();
            this.connections[timestamp] = newConn;
            console.log('ConnPool: [INFO]: Start new connection: ' + timestamp + ' successfully.');
            console.log('ConnPool: [INFO]: Connection Count: ' + Object.keys(this.connections).length);        
            return newConn;
        } catch (e) {
            throw e;
        }
    } else {
        throw 'Start new connection failed: Connection Pool Size Limited.';
    }   
}

NebulaConnPool.prototype.fetchConn = function () {
    var freeConn = this.getFreeConn();
    if (freeConn != null) {
        console.log('ConnPool: [INFO]: Use free connection: ' + freeConn.sttime);
        return freeConn;
    } else {
        console.log('ConnPool: [INFO]: No available connection. Start a new connection.')
        try {
            var address = this.loadBalancer.getMinConnAddress(this);
            if (this.configs === undefined) {
                throw 'Parameters are not configured.';
            } else {
                var newConn = this.startConn(address.host, address.port, this.configs.timeout);
            }
            return newConn;
        } catch (e) {
            throw e
        }   
    }
}

NebulaConnPool.prototype.getSession = function(userName, password, retryConnect=false, useSpace = '') {
    var promise = new Promise((resolve, reject) => {    
        // need to add authenticate
        // var aliveSession = this.SessionRecorder.getSessionByUserName(userName);
        // if (aliveSession != null) {
        //     console.log('SessionRecorder: [WARNING]: Available session of the username: ' + userName + 
        //                     ' already exists. Use it instead: Session ID ' + aliveSession.sessionId + '.');
        //     var sessionWrapper = new SessionWrapper(aliveSession.sessionId);
        //     resolve(sessionWrapper);
        // } else {
            try {
                var newConn = this.fetchConn();
                var that = this;
                var timeout = setTimeout(function() {
                    console.error('ConnPool: [ERROR]: Can\'t connect to graph service.');
                    newConn.status = 'failed';
                    reject(new SessionWrapper(-1));
                }, that.configs.timeout);
                newConn.authenticate(userName, password, function (response) {
                    clearTimeout(timeout);
                    var userSession = that.sessionRecorder.createSession(userName, response.success.session_id, newConn, that.configs.timeout, retryConnect, password);
                    var sessionWrapper = new SessionWrapper(userSession.sessionId);
                    if (useSpace === '') {
                        resolve(sessionWrapper);
                    } else {
                        userSession.execute('USE ' + useSpace)
                        .then(function() {
                            resolve(sessionWrapper);
                        }, function() {
                            reject(new SessionWrapper(-1));
                        })
                    }    
                });
            } catch (e) {
                console.error('ConnPool: [ERROR]: ' + e);
                var errorSessionWrapper = new SessionWrapper(-1);
                reject(errorSessionWrapper);
            }
        // }
    });
    return promise;
}

NebulaConnPool.prototype.getFreeConn = function() {
    for (var sttime in this.connections) {
        if (this.connections[sttime].status === 'free'){
            return this.connections[sttime];
        }
    }
    return null;
}