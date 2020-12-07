/* Copyright (c) 2020 vesoft inc. All rights reserved.
 *
 * This source code is licensed under Apache 2.0 License,
 * attached with Common Clause Condition 1.0, found in the LICENSES directory.
 */

var thrift = require('thrift');
var GraphService = require('../interface/GraphService');


var NebulaConn = exports.NebulaConn = function (host, port, timeout) {
    this.host = host
    this.port = port
    this.timeout = timeout
    this.socket = null
    this.connection = null
}

NebulaConn.prototype.prototype = {};

NebulaConn.prototype.open = function () {
    this.socket = thrift.createConnection(this.host, this.port, {
        connect_timeout : this.timeout,
        timeout : this.timeout,
    });
    this.connection = thrift.createClient(GraphService, this.socket);
}

NebulaConn.prototype.authenticate = function (userName, password, callback) {
    this.connection.authenticate(userName, password, callback);
}

NebulaConn.prototype.execute = function (sessionId, stmt, callback) {
    this.connection.execute(sessionId, stmt, callback);
}

NebulaConn.prototype.signout = function (sessionId) {
    this.connection.signout(sessionId);
}

NebulaConn.prototype.close = function () {
    if (typeof this.socket != 'undefined') {
        this.socket.end();
    }
}