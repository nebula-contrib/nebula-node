# nebula

Author : Wu Jian Ping  
Created Time : 2021/06/09  

nebula nodejs 模块，

- 支持多服务器
- 支持断线重连
- 基于thrift@0.14.1-fixed

## 使用说明

```typescript
import createClient, { ClientOption } from '@qcc/nebula'

// 配置参数
const options: ClientOption = {
  servers: ['ip:port'],
  userName: 'xxx',
  password: 'xxx',
  database: 'database name',
  poolSize: 5, // 连接池大小（可选参数，默认：5）
  bufferSize: 2000, // 离线状态下，缓存任务列表大小（可选参数，默认：2000）
  threshold: 300 // 判定为慢查询阀值（毫秒）（可选参数，默认：300）
  executeTimeout: 15000 // 查询超时（毫秒） (可选参数，默认：15000）
  pingInterval： 60000 // ping轮询时间（毫秒）， （可选参数：默认：60000）
}

// 创建客户端
const client = createClient(sitServer)

// 查询
// 1. 返回处理好的数据（推荐做法）
const response = await client.execute('GET SUBGRAPH 3 STEPS FROM -7897618527020261406')
// 2. 返回原始数据
const response = await client.execute('GET SUBGRAPH 3 STEPS FROM -7897618527020261406', true)

```

## 待处理问题

由于目前数据未出现下列类型，所以未实现这些类型的解析器，待存在后再处理

| 类型名称 | 标识符 |
| -------- | ------ |
| NMap     | mVal   |
| NSet     | uVal   |
| DataSet  | gVal   |
