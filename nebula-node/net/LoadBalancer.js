
var LoadBalancer = exports.LoadBalancer = function() {

}

LoadBalancer.prototype.prototype = {};

LoadBalancer.prototype.getMinConnAddress = function(pool) {
    if (pool.configs === undefined) {
        throw 'Parameters are not configured.';
    } else if (pool.configs.addresses.length === 0) {
        throw 'No available graph service.';
    } else {
        var addressConnnum = {};
        for (var index in pool.configs.addresses) {
            var address = pool.configs.addresses[index];
            var addressStr = address['host'] + ',' + address['port'];
            addressConnnum[addressStr] = 0;
        }
        for (var sttime in pool.connections) {
            var conn = pool.connections[sttime];
            var connAddressStr = conn.host + ',' + conn.port;
            addressConnnum[connAddressStr] += 1;
        }
        // sort by value
        var keys = Object.keys(addressConnnum).sort(function(x, y) {
            return addressConnnum[x] - addressConnnum[y];
        });
        var minConnAddressStrList = keys.filter(function(x) {
            return addressConnnum[x] === addressConnnum[keys[0]];
        });
        var minConnAddressStr = minConnAddressStrList[0].toString();
        var strToList = minConnAddressStr.split(',');
        var address = {
            'host': strToList[0],
            'port': strToList[1]
        };
        console.log('LoadBalancer: [INFO]: Address: ' + minConnAddressStr + 
                        ' has a minimum of connections: ' + addressConnnum[minConnAddressStr] + '.');
        return address;
    }
}