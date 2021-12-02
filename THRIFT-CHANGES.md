# Enhanced thrift based on 0.14.1

- fix auto reconnect issue[PR 2407](https://github.com/apache/thrift/pull/2407)
- fix performance issue in huge data scene

`src/thrift/framed_transport.js`

```javascript
// TFramedTransport.receiver = function(callback, seqid) {
//   var residual = null;

//   return function(data) {
//     // Prepend any residual data from our previous read
//     if (residual) {
//       data = Buffer.concat([residual, data]);
//       residual = null;
//     }

//     // framed transport
//     while (data.length) {
//       if (data.length < 4) {
//         // Not enough bytes to continue, save and resume on next packet
//         residual = data;
//         return;
//       }
//       var frameSize = binary.readI32(data, 0);
//       if (data.length < 4 + frameSize) {
//         // Not enough bytes to continue, save and resume on next packet
//         residual = data;
//         return;
//       }

//       var frame = data.slice(4, 4 + frameSize);
//       residual = data.slice(4 + frameSize);

//       callback(new TFramedTransport(frame), seqid);

//       data = residual;
//       residual = null;
//     }
//   };
// };

TFramedTransport.receiver = function(callback, seqid) {
  var residual = [];
  
  return function(data) {
    // 将接受到的数据存入缓冲区
    for(var i = 0; i < data.length; ++i) {
      residual.push(data[i])
    }

    while (residual.length > 0) {
      // 标识包大小的数据块尚未接收完成，没有的情况下跳出循环等待数据
      if (residual.length < 4) {
        return;
      }
      // 获取单个数据包大小
      var frameSize = binary.readI32(Buffer.from(residual.slice(0, 4)), 0);
      // 看一下缓冲区是否包含完整数据包，没有的情况下跳出循环等待数据
      if (residual.length < 4 + frameSize) {
        return;
      }

      // 对package计数
      metrics.packageCountCounter.inc();
      metrics.packageSizeCounter.inc(frameSize);

      // 移除前面4个字节：这部分数据是用来标识是标识数据包长度的
      residual.splice(0, 4)
      // 根据数据包大小，从缓冲区读取对应大小的数据
      var frame = Buffer.from(residual.splice(0, frameSize));
      // 控制权交给协议层
      callback(new TFramedTransport(frame), seqid);
    }
  };
};
```
