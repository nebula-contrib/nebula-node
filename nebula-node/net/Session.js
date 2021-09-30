/* Copyright (c) 2020 vesoft inc. All rights reserved.
 *
 * This source code is licensed under Apache 2.0 License,
 * attached with Common Clause Condition 1.0, found in the LICENSES directory.
 */

// var express = require('express');
const { config } = require('process');
const { assert } = require('console');
const { resolve } = require('path');
const { reject } = require('q');
var eventEmitter = require('../events').eventEmitter;

var NebulaSession = exports.NebulaSession = function () {
    this.sessionId = -1;
    this.timezone = 'UTC';
    this.status = 'working';   // enum: {'working', 'bad-conn', 'released'}
    this.conn = null;
    this.expiredTime = null;
    this.safe = false;
    this.userName = null;
    this.timeout = null;
    this.retryConnect = null;
}

NebulaSession.prototype.prototype = {};

NebulaSession.prototype.setUserName = function(userName) {
    this.userName = userName;
}

NebulaSession.prototype.setSessionId = function(sessionId) {
    this.sessionId = sessionId;
}

NebulaSession.prototype.setSessionTimezone = function(timezone) {
    this.timezone = timezone;
}

// execute when a session is closed and take the connection back to the pool
NebulaSession.prototype.release = function() {
    this.status = 'released';
    eventEmitter.emit('releaseSession', this.sessionId);
}

NebulaSession.prototype.setSafety = function(safety) {
    this.safe = safety;
}

NebulaSession.prototype.execute = function(stmt) {
    var promise = new Promise((resolve, reject) => {
        // pass stmt back to connection for executing
        if (this.safe === true) {
            console.log('Session: [ERROR]: You\'re using a safe session. Please use \'safe execution\' instead.')
            return null;
        }
        var that = this;
        var timeout = setTimeout(function() {
            console.log('test');
            console.error('Session: [WARNING]: Can\'t connect to graph service. Retrying connecting...');
            if (that.retryConnect) {
                that.ping()
                .then(function() {
                    that.retry(stmt)
                    .then(function(response) {
                        console.log('Session: [INFO]: Retry successfully.');
                        resolve(response.success.data);
                    }, function() {
                        console.error('Session: [ERROR]: Ping successfully but problem occurred when retrying to make an execution.');
                        that.conn.status = 'failed';
                        reject();
                    })
                }, function() {
                    console.error('Session: [ERROR]: Can\'t connect to graph service.');
                    that.conn.status = 'failed';
                    reject();
                });
            } else {
                console.error('Session: [ERROR]: Can\'t connect to graph service.');
                that.conn.status = 'failed';
                reject();
            }
        }, that.timeout);
        this.conn.execute(this.sessionId, stmt, function(response) {
            clearTimeout(timeout);
            if (response.success.error_code != 0) {
                console.log('Session: [ERROR]: Mistake occurred when executing nGQL statement.');
                reject();
            } else {
                resolve(response.success.data);
            }
        });
    });
    return promise;
}

NebulaSession.prototype.safeExecute = function(stmt) {
    // pass stmt back to connection pool for executing
    if (this.safe === false) {
        console.log('Session: [ERROR]: You\'re using a not-safe session. Please use \'execution\' instead.')
    }
    var result = eventEmitter.emit('safeExecute', stmt);
    return result;
}

NebulaSession.prototype.executeJson = function(stmt) {
    // pass stmt back to connection pool for executing
    var result;
    if (this.safe === true) {
        result = eventEmitter.emit('safeExecute', stmt);
    } else {
        result = eventEmitter.emit('execute', stmt);
    }
    result = JSON.stringify(result);
    return result;
}

// ping
NebulaSession.prototype.ping = function() {
    var promise = new Promise((resolve, reject) => {
        var that = this;
        var timeout = setTimeout(function() {
            console.error('Session: [ERROR]: ping timeout.');
            reject('timeout');
        }, that.timeout);
        this.conn.ping(function(response) {
            clearTimeout(timeout);
            if (response.success.error_code != 0) {
                console.log('Session: [ERROR]: ping failed.');
                reject('fail');
            } else {
                console.log('Session: [ERROR]: ping successfully.');
                resolve('success');
            }
        });
    });
    return promise;
}

NebulaSession.prototype.retry = function(stmt) {
    var promise = new Promise((resolve, reject) => {
        var that = this;
        that.conn.authenticate(that.userName, that.password, function(response) {
            if (response.success.error_code != 0) {
                reject();
            } else {
                sessionId = response.success.sessionId;
                that.conn.execute(sessionId, stmt, function(response) {
                    if (response.success.error_code != 0) {
                        console.log('Session: [ERROR]: Mistake occurred when executing nGQL statement.');
                        reject();
                    } else {
                        resolve(response.success.data);
                    }
                });
            }
        });
    });
    return promise;
}