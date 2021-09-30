/* Copyright (c) 2020 vesoft inc. All rights reserved.
 *
 * This source code is licensed under Apache 2.0 License,
 * attached with Common Clause Condition 1.0, found in the LICENSES directory.
 */

var thrift = require('thrift');
var GraphService = require('../interface/GraphService');

var Connection = exports.Connection = function (host, port, timeout, sttime) {
    this.sttime = sttime;
    this.host = host;
    this.port = port;
    this.timeout = timeout;
    this.status = 'working';    // enum: {'working', 'free', 'failed'}
    this.connection = null;
    this.socket = null;
}

Connection.prototype.prototype = {};

Connection.prototype.open = function () {
    this.socket = thrift.createConnection(this.host, this.port, {
        connect_timeout : this.timeout,
        timeout : this.timeout,
    });
    this.connection = thrift.createClient(GraphService, this.socket);
}

Connection.prototype.authenticate = function (userName, password, callback) {
    this.connection.authenticate(userName, password, callback);
}

Connection.prototype.execute = function (sessionId, stmt, callback) {
    this.connection.execute(sessionId, stmt, callback);
}

Connection.prototype.signout = function (sessionId) {
    this.connection.signout(sessionId);
}

Connection.prototype.close = function () {
    if (typeof this.socket != 'undefined') {
        this.socket.end();
    }
}

Connection.prototype.ping = function() {
    this.connection.execute(0, 'YIELD 1', callback);
}