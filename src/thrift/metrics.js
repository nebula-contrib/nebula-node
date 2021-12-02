/**
 * Created by Wu Jian Ping on - 2021/10/14.
 */

var prometheus = require('@qcc/metrics').prometheus

const THRIFT_PACKAGE_SIZE_IN_BYTES = 'thrift_package_size_in_byte'
const THRIFT_PACKAGE_COUNT = 'thrift_package_count'

var packageSizeCounter = new prometheus.Counter({
  name: THRIFT_PACKAGE_SIZE_IN_BYTES,
  help: 'thrift package size in bytes'
});

var packageCountCounter = new prometheus.Counter({
  name: THRIFT_PACKAGE_COUNT,
  help: 'thrift package count'
});

module.exports.packageSizeCounter = packageSizeCounter;
module.exports.packageCountCounter = packageCountCounter;