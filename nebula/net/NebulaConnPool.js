/* Copyright (c) 2020 vesoft inc. All rights reserved.
 *
 * This source code is licensed under Apache 2.0 License,
 * attached with Common Clause Condition 1.0, found in the LICENSES directory.
 */

var NebulaConn = require("./Connection").Connection;
var NebulaSession = require("./Session").NebulaSession;
// var SessionManage = require("./SessionManage").SessionManage;
var eventEmitter = require("../events").eventEmitter;
const assert = require("assert");

var NebulaConnPool = exports.NebulaConnPool = function() {
    this.connections = {};
    this.sessions = {};
}

NebulaConnPool.prototype.prototype = {};

NebulaConnPool.prototype.init = function(addresses, configs) {
    this.addresses = addresses;
    this.configs = configs;

    eventEmitter.on("release", function(userName) {
        for (var key in this.sessions) {
            if (this.sessions.key.userName == userName) {
                delete this.sessions.key;
                console.log("Session" + key + "Released!");
            }
        }
    });
}

NebulaConnPool.prototype.close = function() {
    for (var id in this.connections) {
        this.connections[id].close();
        console.log("Close Connection: " + id);
    }
    // for (var userName in this.sessions) {
    //     this.connections[id].close();
    //     console.log("Close Connection: " + id);
    // }
}

NebulaConnPool.prototype.startConn = function(ip, port, timeout) {
    if (Object.keys(this.connections).length < this.configs.maxConnectionPoolSize) {
        var newConn = new NebulaConn(ip, port, timeout);
        newConn.open();
        var timestamp = new Date().getTime();
        this.connections[timestamp] = newConn;
        console.log("Start new connection successfully!");
        console.log("Connection Count: " + Object.keys(this.connections).length);        
        return newConn;
    } else {
        console.log("Start new connection failed: Connection Pool Size Limited!");
        return -1;
    }   
}

NebulaConnPool.prototype.getSession = function(userName, password, retryConnect=true) {
    var promise = new Promise((resolve, reject) => {    
        // need to add authenticate
        for (var key in this.sessions) {
            if (this.sessions.key.userName == userName) {
                console.log("Session exists!");
                return this.sessions.key;
            }
        }
        var newSession = new NebulaSession();
        var newConn = this.startConn('localhost', 9669, this.configs.timeout, function(response) {
            assert(response != -1);
        });
        var that = this;
        newConn.authenticate(userName, password, function (response) {
            // assert(response.success.error_code == 0);
            // assert(response.success.session_id != 0);
            newSession.sessionId = response.success.session_id;
            newSession.userName = userName;
            newSession.conn = newConn;
            that.sessions[newSession.userName] = newSession;
            resolve(newSession);
        });
    });
    return promise;
}
    

