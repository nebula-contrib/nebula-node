/* Copyright (c) 2020 vesoft inc. All rights reserved.
 *
 * This source code is licensed under Apache 2.0 License,
 * attached with Common Clause Condition 1.0, found in the LICENSES directory.
 */

var NebulaConn = require('./Connection').Connection;
var SessionManager = require('./SessionManager').SessionManager;
var eventEmitter = require('../events').eventEmitter;
const assert = require('assert');

var NebulaConnPool = exports.NebulaConnPool = function() {
    this.connections = {};
    this.sesstionManager = new SessionManager();
    this.addresses = new Array();
}

NebulaConnPool.prototype.prototype = {};

NebulaConnPool.prototype.init = function(configs) {
    this.addresses = configs.addresses;
    this.configs = configs;

    var that = this;
    eventEmitter.on('delAddress', function(delIndex) {
        that.addresses.splice(delIndex, 1);
    });

    eventEmitter.on('setConnFree', function(sttime) {
        that.connections[sttime].status = 'free';
        console.log('[INFO]: Set connection: ' + sttime + ' status free.');
    });
}

NebulaConnPool.prototype.close = function() {
    for (var id in this.connections) {
        this.connections[id].close();
        console.log('Close Connection: ' + id);
    }
    eventEmitter.emit('connPoolClose');
}

NebulaConnPool.prototype.startConn = function(ip, port, timeout) {
    if (Object.keys(this.connections).length < this.configs.maxConnectionPoolSize) {
        var timestamp = new Date().getTime();
        var newConn = new NebulaConn(ip, port, timeout, timestamp);
        newConn.open();
        this.connections[timestamp] = newConn;
        console.log('[INFO]: Start new connection: ' + timestamp + ' successfully!');
        console.log('[INFO]: Connection Count: ' + Object.keys(this.connections).length);        
        return newConn;
    } else {
        console.log('[ERROR]: Start new connection failed: Connection Pool Size Limited!');
        return -1;
    }   
}

NebulaConnPool.prototype.getSession = function(userName, password, retryConnect=true) {
    var promise = new Promise((resolve, reject) => {    
        // need to add authenticate
        var aliveSession = this.sesstionManager.findByUserName(userName);
        if (aliveSession != null) {
            resolve(aliveSession);
        } else {

            var freeConn = this.getFreeConn();
            if (freeConn != null) {
                var newConn = freeConn;
                console.log('[INFO]: Use free connection: ' + freeConn.sttime);
            } else {
                console.log('[INFO]: No available connection. Execute startConn.')
                var address = this.addresses[0];    // need LoadBalance module
                var newConn = this.startConn(address.host, address.port, this.configs.timeout, function(response) {
                    assert(response != -1);
                });
            }
            
            var that = this;
            newConn.authenticate(userName, password, function (response) {
                var userSession = that.sesstionManager.createSession(userName, response.success.session_id, newConn);
                resolve(userSession);
            });
        }
    });
    return promise;
}

NebulaConnPool.prototype.getFreeConn = function() {
    for (var stmt in this.connections) {
        if (this.connections[stmt].status === 'free'){
            return this.connections[stmt];
        }
    }
    return null;
}