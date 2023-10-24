# thrift定义文件来源

[root](https://github.com/vesoft-inc/nebula/tree/master/src/interface)  
[common.thrift](https://github.com/vesoft-inc/nebula/blob/master/src/interface/common.thrift)  
[graph.thrift](https://github.com/vesoft-inc/nebula/blob/master/src/interface/graph.thrift)

```shell
# thrift@0.19.0
# https://www.apache.org/dyn/closer.cgi?path=/thrift/0.19.0/thrift-0.19.0.tar.gz
thrift --gen js:node,ts,es6,with_ns graph.thrift
thrift --gen js:node,ts,es6,with_ns common.thrift
```
