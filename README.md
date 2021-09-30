# nebula-nodejs

Nebula NodeJS is a client package with NodeJS API for Nebula Graph.

It is used to connect with Nebula Graph 2.0 from user's node project.

\<package-name>: nebula-client

## Prerequisites

- OS: Linux System (recommended with kernel version of 2.6.32 and above).
- [Node.js](https://nodejs.org/en/) is installed.
- Nebula Graph service is deployed (nightly version is also supported).

  Refer to [Document of Nebula Graph 2.0.1](https://docs.nebula-graph.com.cn/2.0.1/) for more information about the usage and deployment of Nebula Graph.

## Before you start

### 1. Install \<package-name> package.
``` bash
npm install <package-name>
```

### 2. Make sure Nebula Graph service is started with configuration.
```bash
sudo {NebulaGraph PATH}/scripts/nebula.service status all
```

## Usage
### 1. Import \<package-name> in nodejs project.
```javascript
var NebulaClient = require(<package-name>);
```

### 2. Create global event emitter.
```javascript
var eventEmitter = NebulaClient.eventEmitter;
```

### 3. Make global configuration of connection pool and graphd info.
```javascript
var configs = new NebulaClient.Configs;
configs.setTimeout(timeout);                    // int timeout: seconds
configs.setIdleTime(idleTime);                  // int idleTime: seconds
configs.setMaxConnectionPoolSize(maxPoolSize);  // int maxPoolSize > 0
configs.setMinConnectionPoolSize(minPoolSize);  // int minPoolSize > 0
configs.setAddresses(Address);  // List Address: [{'host': (str)host/ip, 'port': (int)portid}, {}, ...]
configs.addAddress(host, port);
configs.delAddress(host, port);
```

### 4. Create connection pool.
```javascript
var pool = new NebulaClient.NebulaConnPool;
pool = init(configs);
```

### 5. Get session from connection pool. Interact with Nebula Graph service with session.
```javascript
// Asynchronous methods are encapsulated with Promise mechanism
pool.getSession('root', 'nebula')
    .then(function(session) {
        session.execute(<stmt>);    // wait for async function
        .then(function() {
            session.release();      // release session
            pool.close();           // close the connection pool
        }
    };
```

**hint: The exception throwed by async function should be handled in reject block of promise.**

## Framework
```
.
├── nebula-node
│   ├── config.js						
│   ├── events.js						
│   ├── index.js
│   ├── interface                       // underlying DBMS API
│   │   ├── common_types.js             // common data type in database
│   │   ├── GraphService.js             // encapsulate interaction with DBMS
│   │   └── graph_types.js              // graph-featured data structure in database
│   └── net
│       ├── Connection.js               // encapsulate thrift API
│       ├── NebulaConnPool.js           // user interface, load balancer
│       ├── Session.js                  // user interface
│       └── SessionManager.js			
├── test
│   ├── nebulaconn.test.js
│   └── nebulasession.test.js
├── package.json
├── package-lock.json
└── README.md
```

## Unit Test

Mocha test framework is used.

### 功能测试：

|     测试模块      |          功能           |                         预期目标                         | 测试结果 |
| :---------------: | :---------------------: | :------------------------------------------------------: | :------: |
| Nebula Connection |       连接服务器        |          成功建立与graphd的连接，未返回错误代码          |   通过   |
|                   |        身份验证         | 传入正确的身份验证信息，登陆成功；身份验证错误，登陆失败 |   通过   |
|                   |   执行nGQL语句并返回    |          返回正确的结果或执行反馈，并与预期一致          |   通过   |
|      Session      | session对象给用户的封装 | 向用户返回session的封装接口，用户无法持有session对象本身 |   通过   |
|                   |   多session场景的管理   |        多session场景下，各session能够正确实现功能        |   通过   |
|                   | 通过session执行nGQL语句 |         session通过connection连接graphd执行语句          |   通过   |
|                   |       释放session       |      销毁session对象；被释放的session不能再次被使用      |   通过   |
|  Connection Pool  |       创建连接池        |          创建连接池，配置可用的nebula graph服务          |   通过   |
|                   |       配置连接池        | 能够实现nebula graph服务的增删，修改连接池可容纳连接数等 |   通过   |
|                   | 从连接池对象获取session | session对象存入session recorder统一管理，将封装对象返回  |   通过   |
|                   |  空闲connection的复用   |    signout后的空闲连接可以在其他连接请求到来时被复用     |   通过   |
|                   |       连接池关闭        |      关闭前释放所有的session，断开所有的connection       |   通过   |
|   Load Balancer   |     连接的负载均衡      |        在创建新连接时，选择graphd连接最少的服务端        |   通过   |

### 健壮性测试：

|   异常分类   |          边界条件           |                      预期处理                      | 测试结果 |
| :----------: | :-------------------------: | :------------------------------------------------: | :------: |
|   配置异常   |      未配置连接池参数       |                抛出异常，参数未配置                |   通过   |
|              | 未配置可使用的graph service |        抛出异常，不存在可用的graph service         |   通过   |
| 服务连接异常 |   connection连接建立失败    |              抛出异常，无法连接到服务              |   通过   |
|              |   ping graphd 地址时失败    |           抛出异常，服务器关闭或地址有误           |   通过   |
|              |  使用活动中的session时失败  | 判断服务是否还在，若还在则尝试重连，不在则抛出异常 |   通过   |
| nGQL执行异常 |          语法错误           |                 抛出异常，语法错误                 |   通过   |
|              |         执行时错误          |               抛出异常，语句执行错误               |   通过   |
| 用户非法操作 |  使用一个已经释放的session  |       抛出异常，该session已被释放，无法使用        |   通过   |
|              |   connection数量到达上限    |          抛出异常，无法创建新的connection          |   通过   |
