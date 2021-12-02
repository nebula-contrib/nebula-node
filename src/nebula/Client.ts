/**
 * Created by Wu Jian Ping on - 2021/06/11.
 */

import _ from 'lodash'
import Connection from './Connection'
import { ClientOption, Task, Endpoint } from './types'
import NebulaError from './NebulaError'
import { EventEmitter } from 'events'

let AsyncResource
let executionAsyncId
let isSupported = false

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const asyncHooks = require('async_hooks')
  if (
    typeof asyncHooks.AsyncResource.prototype.runInAsyncScope === 'function'
  ) {
    AsyncResource = asyncHooks.AsyncResource
    executionAsyncId = asyncHooks.executionAsyncId
    isSupported = true
  }
} catch (e) {
  console.log('async_hooks does not support') // eslint-disable-line
}

const getNumberValue = (actualValue: number, defaultValue: number): number => {
  if (!_.isInteger(actualValue)) {
    return defaultValue
  } else if (actualValue <= 0) {
    return defaultValue
  }
  return actualValue
}

export default class Client extends EventEmitter {
  private clientOption: ClientOption = null;
  private connections: Connection[] = [];
  private taskQueue: Task[] = [];
  private connectionGuarders: NodeJS.Timeout[] = [];

  constructor(option: ClientOption) {
    super()

    // poolSize
    option.poolSize = getNumberValue(option.poolSize, 5)
    // Cached command buffer size
    option.bufferSize = getNumberValue(option.bufferSize, 2000)
    // executing timeout in ms
    option.executeTimeout = getNumberValue(option.executeTimeout, 10000)
    // ping suration in ms
    option.pingInterval = getNumberValue(option.pingInterval, 60000)

    this.clientOption = option

    this.connections = []

    _.forEach(this.clientOption.servers, conf => {
      for (let i = 0; i < this.clientOption.poolSize; ++i) {
        let host = null
        let port = null
        if (_.isString(conf)) {
          const list = conf.split(':')
          if (list.length !== 2) {
            throw new NebulaError(9998, `Config Error for nebula:${conf}`)
          }
          host = list[0]
          port = +list[1]
        } else if (_.isPlainObject(conf)) {
          host = (conf as Endpoint).host
          port = (conf as Endpoint).port
        } else {
          throw new NebulaError(9998, 'Config Error for nebula')
        }

        if (!host) {
          throw new NebulaError(9998, 'Config Error for nebula, host is invalid')
        }

        if (!_.isInteger(port) || port < 0) {
          throw new NebulaError(9998, 'Config Error for nebula, port is invalid')
        }

        const connection: Connection = new Connection({
          host,
          port,
          userName: this.clientOption.userName,
          password: this.clientOption.password,
          database: this.clientOption.database
        })

        connection.on('ready', ({ sender }: { sender: Connection }) => {
          this.emit('ready', { sender })
        })

        connection.on('free', ({ sender }: { sender: Connection }) => {
          if (this.taskQueue.length > 0) {
            const task = this.taskQueue.shift()
            if (task.asyncResource) {
              task.asyncResource.runInAsyncScope(sender.run, sender, task)
              task.asyncResource.emitDestroy()
            } else {
              sender.run(task)
            }
          }
        })

        connection.on('error', ({ sender, error }: { sender: Connection, error: NebulaError }) => {
          // https://github.com/nodejs/node/blob/84d6ce9fd15a20c0d0c8c23e9b6c0d1b25b8325f/doc/api/errors.md#err_unhandled_error
          // https://github.com/nodejs/node/blob/5ce015ec72be98f064041d1bf5c3527a89c276cc/lib/events.js#L355
          if ((this as any)?._events?.error) {
            this.emit('error', { sender, error })
          }
        })

        connection.on('connected', ({ sender }: { sender: Connection }) => {
          this.emit('connected', { sender })
        })

        connection.on('authorized', ({ sender }: { sender: Connection }) => {
          this.emit('authorized', { sender })
        })

        connection.on('reconnecting', ({ sender, retryInfo }: { sender: Connection, retryInfo: any }) => {
          this.emit('reconnecting', { sender, retryInfo })
        })

        connection.on('close', ({ sender }: { sender: Connection }) => {
          this.emit('close', { sender })
        })

        connection.connectionId = `${host}-${port}-${i}`

        // set ping jobs
        this.connectionGuarders.push(setInterval(() => {
          connection.ping(this.clientOption.executeTimeout)
        }, this.clientOption.pingInterval))

        this.connections.push(connection)
      }
    })
  }

  /**
   * Execute command
   *
   * @param command Command
   * @param returnOriginalData Return nebula orginal response?
   * @returns
   */
  execute(command: string, returnOriginalData = false): Promise<any> {
    return new Promise((resolve, reject) => {
      const timeout = this.clientOption.executeTimeout
      const asyncResourceForExecute = new AsyncResource('nebula', executionAsyncId())
      const asyncResourceForTimeout = new AsyncResource('nebula', executionAsyncId())
      const task: Task = {
        command,
        returnOriginalData,
        resolve,
        reject,
        executingTimer: setTimeout(() => {
          const err = new NebulaError(9996, `Execute command timeout after ${timeout}`)
          asyncResourceForTimeout.runInAsyncScope(() => { reject(err) })
          asyncResourceForTimeout.emitDestroy()
        }, timeout)
      }

      if (isSupported) {
        task.asyncResource = asyncResourceForExecute
      }

      const freeConnections = _.filter(this.connections, o => (o.isReady && !o.isBusy))
      if (freeConnections.length > 0) {
        const seed = _.random(0, freeConnections.length - 1)
        const connection = freeConnections[seed]
        if (task.asyncResource) {
          task.asyncResource.runInAsyncScope(connection.run, connection, task)
          task.asyncResource.emitDestroy()
        } else {
          connection.run(task)
        }
      } else {
        if (this.taskQueue.length >= this.clientOption.bufferSize) {
          const taskShouldReject = this.taskQueue.shift()
          const err = new NebulaError(9997, 'Nebula command buffer is full')
          if (taskShouldReject.asyncResource) {
            taskShouldReject.asyncResource.runInAsyncScope(() => { taskShouldReject.reject(err) })
            taskShouldReject.asyncResource.emitDestroy()
          } else {
            taskShouldReject.reject(err)
          }
        }

        // add task to taskQueue
        this.taskQueue.push(task)
      }
    })
  }

  close(): Promise<any> {
    // clear guarder
    _.forEach(this.connectionGuarders, timer => {
      clearInterval(timer)
    })

    return Promise.all([
      ..._.map(this.connections, o => o.close())
    ])
  }
}
