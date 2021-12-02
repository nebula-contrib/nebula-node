# Nebula Nodejs SDK

This repository provides Nebula client API in Nodejs.

## Features

### Muti-Server Support

### Auto-reconnection support

Client will try to reconnect forever, until the server is available again.

### Connection pool support

### Disconnection detection

A heartbeat mechanism is implemented, client will send ping to server each `pingInterval` ms for detect connective

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

### Example

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
const response = await client.execute('GET SUBGRAPH 3 STEPS FROM -7897618527020261406', true)

```

## TODO

Not implemented data type

| Data Type | variable name in nebula response |
| --------- | -------------------------------- |
| NMap      | mVal                             |
| NSet      | uVal                             |
| DataSet   | gVal                             |
