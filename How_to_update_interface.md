# How to update the files under nebula/interface

## Firstly: Generate the files

under Linux

```
wget https://oss-cdn.nebula-graph.com.cn/third-party/vesoft-third-party-x86_64-libc-2.12-gcc-7.5.0-abi-11.sh
sudo bash vesoft-third-party-x86_64-libc-2.12-gcc-7.5.0-abi-11.sh
wget https://raw.githubusercontent.com/vesoft-inc/nebula-common/master/src/common/interface/common.thrift
wget https://raw.githubusercontent.com/vesoft-inc/nebula-common/master/src/common/interface/graph.thrift
/opt/vesoft/third-party/bin/thrift1 --strict --allow-neg-enum-vals --gen "js:node:" -o . common.thrift
/opt/vesoft/third-party/bin/thrift1 --strict --allow-neg-enum-vals --gen "js:node:" -o . graph.thrift
```

Then you can see the new directory `gen-js` has generated.

## Secondly: Compare the generated files

You need to compare the generated files with the files under `nebula/interface`
If compare completed, replace the files under `nebula/interface`

## Thirdly: Run test or add test to check the new interface

Run test to check the interface.
```
npm test
```