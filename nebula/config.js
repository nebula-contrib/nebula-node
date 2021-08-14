const { config } = require("chai");

var Configs = exports.Configs = function() {
    this.timeout = 0;
    this.idleTime = 0;
    this.maxConnectionPoolSize = 0;
    this.minConnectionPoolSize = 0;
}

Configs.prototype.prototype = {}

Configs.prototype.setTimeout = function(timeout) {
    this.timeout = timeout;
}

Configs.prototype.setIdleTime = function(idleTime) {
    this.idleTime = idleTime;
}

Configs.prototype.setMaxConnectionPoolSize = function(maxConnectionPoolSize) {
    this.maxConnectionPoolSize = maxConnectionPoolSize;
}

Configs.prototype.setMinConnectionPoolSize = function(minConnectionPoolSize) {
    this.minConnectionPoolSize = minConnectionPoolSize;
}