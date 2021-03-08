/* Copyright (c) 2020 vesoft inc. All rights reserved.
 *
 * This source code is licensed under Apache 2.0 License,
 * attached with Common Clause Condition 1.0, found in the LICENSES directory.
 */

var NebulaConn = require("./NebulaConn").NebulaConn

var NebulaConnPool = exports.NebulaConnPool = function (addresses, userName, password, configs) {
    this.addresses = addresses || []
    this.userName = userName
    this.password = password
    this.configs = configs
    this.connections = {}
}