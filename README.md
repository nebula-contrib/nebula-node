# Nebula Nodejs SDK

This repository provides Nebula client API in Nodejs.

## Features

- Muti-Server Support
- Auto-reconnection support

  Client will try to reconnect forever, until the server is available again.  

- Connection pool support
- Disconnection detection

  A heartbeat mechanism is implemented, client will send ping to server each `pingInterval` ms for detect connective

- [Thrift enhancement](./THRIFT-CHANGES.md)

## API

### Connection Options

| parameter      | type     | description                                                                     |
| -------------- | -------- | ------------------------------------------------------------------------------- |
| servers        | string[] | nebula servers                                                                  |
| userName       | string   | username for login                                                              |
| password       | string   | password for login                                                              |
| poolSize       | number   | Pool size for each server(Optional, default：5)                                 |
| bufferSize     | number   | Command cache in offline or before established connect (Optional, defaul: 2000) |
| executeTimeout | number   | Command executing timeout in ms (Optional, default：10000)                      |
| pingInterval   | number   | for keepalive, ping duration in ms, (Optional, default：60000）                 |

### How To

#### Install

```shell
npm install nebula-nodejs --save --unsafe-perm
```

#### Simple and convenient API

```typescript
import createClient, { ClientOption } from 'nebula-nodejs'

// Connection Options
const options: ClientOption = {
  servers: ['ip-1:port','ip-2:port'],
  userName: 'xxx',
  password: 'xxx',
  database: 'database name',
  poolSize: 5,
  bufferSize: 2000,
  executeTimeout: 15000
  pingInterval： 60000
}

// Create client
const client = createClient(options)

// Execute command
// 1. return parsed data (recommend)
const response = await client.execute('GET SUBGRAPH 3 STEPS FROM -7897618527020261406')
// 2. return nebula original data
const responseOriginal = await client.execute('GET SUBGRAPH 3 STEPS FROM -7897618527020261406', true)

```

#### Events

| parameter         | description                                  |
| ----------------- | -------------------------------------------- |
| sender            | the individual connection in connection pool |
| error             | Nebula Error                                 |
| retryInfo         | Retry information                            |
| retryInfo.delay   | delay time                                   |
| retryInfo.attempt | total attempts                               |

```javascript
const client = createClient(options)

// connection is ready for executing command
client.on('ready', ({sender}) => {

})

// error occurs
client.on('error', ({ sender, error }) => {

})

// connected event
client.on('connected', ({ sender }) => {

})

// authorized successfully
client.on('authorized', ({ sender }) => {

})

// reconnecting
client.on('reconnecting', ({ sender, retryInfo }) => {

})

// closed
client.on('close', { sender }) => {

}
```

### About hash64 function

`nebula-nodejs` exports `hash64` function for converting `string` to `string[]`, it's based on `MurmurHash3`.

```javascript
import { hash64 } from 'nebula-nodejs'

const results = hash64('f10011b64aa4e7503cd45a7fdc24387b')

console.log(results)

// Output:
// ['2852836996923339651', '-6853534673140605817']
```

### About Int64

nodejs cannot repreent `Int64`, so we convert `Int64` bytes to `string`

```javascript
import { bytesToLongLongString } from 'nebula-nodejs'

const s = '-7897618527020261406'

const buffer = [146, 102, 5, 203, 5, 105, 223, 226]
const result = bytesToLongLongString(buffer)

// result equals s
```

## Development

### Build

```shell
git clone https://github.com/vesoft-inc/nebula-node.git
cd nebula-node
npm install --unsafe-perm
npm run build
```

### Unit Test

```shell
npm run build
npm run test
```

### Unit Test Coverage

```shell
npm run coverage
```

### Publish

```shell
npm run build
cd dist
npm publish
```

## TODO

Not implemented data type for auto parser

| Data Type | property name in nebula response |
| --------- | -------------------------------- |
| NMap      | mVal                             |
| NSet      | uVal                             |
| DataSet   | gVal                             |
