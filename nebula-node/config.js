const { config } = require("chai");

var eventEmitter = require("./events").eventEmitter;

var Configs = exports.Configs = function() {
    this.timeout = 1000;
    this.idleTime = 0;
    this.maxConnectionPoolSize = 100;
    this.minConnectionPoolSize = 0;
    this.addresses = new Array();
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

Configs.prototype.setAddresses = function(addresses) {
    this.addresses = addresses;
}

Configs.prototype.addAddress = function(host, port) {
    var address = {
        'host': host,
        'port': port
    };
    this.addresses.push(address);
    eventEmitter.emit('addAddress', address);
}

Configs.prototype.delAddress = function(host, port) {
    var delItem = {
        'host': host,
        'port': port
    };
    var delIndex = indexOfJson(this.addresses, delItem);
    if (delIndex === -1) {
        // error handler
        console.log('host&port not exists.');
    } else {
        this.addresses.splice(delIndex, 1);
        eventEmitter.emit('delAddress', delIndex);
    }
}

var indexOfJson = function(jsonArray, json) {
    for (var index in jsonArray) {
        if (json['host'] === jsonArray[index]['host'] && json['port'] === jsonArray[index]['port']) {
            return index;
        }
    }
    return -1;
}