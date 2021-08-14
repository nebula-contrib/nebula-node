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

### 2. Make global configuration of connection pool and graphd info.
```javascript
var configs = new NebulaClient.Configs;
configs.setTimeout(timeout);                    // int timeout: seconds
configs.setIdleTime(idleTime);                  // int idleTime: seconds
configs.setMaxConnectionPoolSize(maxPoolSize);  // int maxPoolSize > 0
configs.setMinConnectionPoolSize(minPoolSize);  // int minPoolSize > 0
configs.setAddresses(Address);  // List Address: [{'ip': (str)hostip; 'port': (int)portid}, {}, ...]
```

### 3. Create connection pool.
```javascript
var pool = new NebulaClient.NebulaConnPool;
pool = init(configs);
```

### 4. Get session from connection pool. Interact with Nebula Graph service with session.
```javascript
// Asynchronous methods are encapsulated with Promise mechanism
pool.getSession('root', 'nebula')
    .then(function(session) {
        session.execute(<stmt>);
        .then(function() {
            session.release();
            pool.close();
        }
    }
```