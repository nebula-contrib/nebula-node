/* Copyright (c) 2020 vesoft inc. All rights reserved.
 *
 * This source code is licensed under Apache 2.0 License,
 * attached with Common Clause Condition 1.0, found in the LICENSES directory.
 */

// var express = require("express");
const { config } = require("process");
const { assert } = require("console");
const { resolve } = require("path");
const { reject } = require("q");
var eventEmitter = require("../events").eventEmitter;

var NebulaSession = exports.NebulaSession = function () {
    this.sessionId = -1;
    this.timezone = "UTC";
    this.status = "not released";   // enum: {"not released", "released"}
    this.conn = null;
    this.expiredTime = null;
    this.safe = false;
    this.userName = null;
    this.password = null;
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
    this.status = "released";
    eventEmitter.emit("release", this.userName);
}

NebulaSession.prototype.setSafety = function(safety) {
    this.safe = safety;
}

NebulaSession.prototype.execute = function(stmt) {
    var promise = new Promise((resolve, reject) => {
        // pass stmt back to connection for executing
        if (this.safe == true) {
            console.log("Error: You're using a safe session. Please use 'safe execution' instead")
            return null;
        }
        this.conn.execute(this.sessionId, stmt, function(response) {
            // if (response.success.error_code != 0) {
            //     // error_handler
            // }
            resolve(null);
        });
    });
    return promise;
}

NebulaSession.prototype.safeExecute = function(stmt) {
    // pass stmt back to connection pool for executing
    if (this.safe == false) {
        console.log("Error: You're using a not-safe session. Please use 'execution' instead")
    }
    var result = eventEmitter.emit("safeExecute", stmt);
    return result;
}

NebulaSession.prototype.executeJson = function(stmt) {
    // pass stmt back to connection pool for executing
    var result;
    if (this.safe == true) {
        result = eventEmitter.emit("safeExecute", stmt);
    } else {
        result = eventEmitter.emit("execute", stmt);
    }
    result = JSON.stringify(result);
    return result;
}

// ping

// retryConnect