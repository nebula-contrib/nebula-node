/* Copyright (c) 2020 vesoft inc. All rights reserved.
 *
 * This source code is licensed under Apache 2.0 License,
 * attached with Common Clause Condition 1.0, found in the LICENSES directory.
 */

var thrift = require('thrift');
var GraphService = require('../interface/GraphService');


var Connection = exports.Connection = function (host, port, timeout) {
    this.host = host
    this.port = port
    this.timeout = timeout
    this.socket = null
    this.connection = null
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