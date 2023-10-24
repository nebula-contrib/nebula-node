/**
 * Created by Wu Jian Ping on - 2021/06/09.
 */

import _ from 'lodash'
import thrift from 'thrift'
import { EventEmitter } from 'events'
import Int64 from 'node-int64'
import { ConnectionOption, ConnectionInfo, Task } from './types'
import { traverse } from './parser'
import NebulaError from './NebulaError'
import * as GraphService from './services/GraphService'

export default class Connection extends EventEmitter {
  private connectionOption: ConnectionOption;
  private connection: thrift.Connection;
  private client: InstanceType<typeof GraphService.Client>;
  private sessionId: Int64;
  public connectionId: string;
  // 是否完成执行命令前所有操作
  public isReady = false;
  // 是否空闲
  public isBusy = true;

  constructor(connectionOption: ConnectionOption) {
    super()

    connectionOption = _.defaults(connectionOption, {
      bufferSize: 2000,
      poolSize: 5
    })

    this.connectionOption = connectionOption

    // 创建连接
    this.connection = thrift.createConnection(this.connectionOption.host, this.connectionOption.port, {
      max_attempts: Number.MAX_SAFE_INTEGER,
      retry_max_delay: 1000,
      transport: thrift.TFramedTransport
    })

    // 创建客户端
    this.client = thrift.createClient(GraphService, this.connection)

    this.connection.on('error', (err: Error) => {
      this.isReady = false
      this.isBusy = true

      // https://github.com/nodejs/node/blob/84d6ce9fd15a20c0d0c8c23e9b6c0d1b25b8325f/doc/api/errors.md#err_unhandled_error
      // https://github.com/nodejs/node/blob/5ce015ec72be98f064041d1bf5c3527a89c276cc/lib/events.js#L355
      if ((this as any)?._events?.error) {
        this.emit('error', { sender: this, error: err })
      }
    })

    this.connection.on('connect', () => {
      this.emit('connected', { sender: this })

      this.prepare()
    })

    this.connection.on('close', () => {
      this.isReady = false
      this.isBusy = true

      this.emit('close', { sender: this })
    })

    this.connection.on('reconnecting', ({ delay, attempt }) => {
      this.emit('reconnecting', { sender: this, retryInfo: { delay, attempt } })
    })
  }

  prepare(): void {
    this
      .client
      .authenticate(this.connectionOption.userName, this.connectionOption.password)
      .then((response: any) => {
        if (response.error_code !== 0) {
          throw new NebulaError(response.error_code, response.error_msg)
        }
        this.sessionId = new Int64(response.session_id.buffer)

        this.emit('authorized', { sender: this })

        return new Promise((resolve, reject) => {
          this.run({
            command: `Use ${this.connectionOption.space}`,
            returnOriginalData: false,
            resolve,
            reject
          })
        })
      })
      .then((response: any) => {
        if (response.error_code !== 0) {
          throw new NebulaError(response.error_code, response.error_msg)
        }

        this.isReady = true
        this.isBusy = false

        this.emit('ready', { sender: this })
        this.emit('free', { sender: this })
      })
      .catch((err: NebulaError) => {
        this.isReady = false
        this.isBusy = true

        // https://github.com/nodejs/node/blob/84d6ce9fd15a20c0d0c8c23e9b6c0d1b25b8325f/doc/api/errors.md#err_unhandled_error
        // https://github.com/nodejs/node/blob/5ce015ec72be98f064041d1bf5c3527a89c276cc/lib/events.js#L355
        if ((this as any)?._events?.error) {
          this.emit('error', { sender: this, error: err })
        }
        const self = this
        setTimeout(() => { this.prepare.bind(self)() }, 1000)
      })
  }

  close(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.connection.connected) {
        Promise
          .resolve()
          .then(() => {
            return this.isReady ? this.client.signout(this.sessionId) : Promise.resolve()
          })
          .then(() => {
            return this.connection.end()
          })
          .then(() => {
            resolve({})
          })
          .catch(reject)
      } else {
        resolve({})
      }
    })
  }

  ping(timeout: number): Promise<boolean> {
    if (this.connection.connected) {
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => { resolve(false) }, timeout)
        this
          .client
          .execute(this.sessionId, Buffer.from('YIELD 1', 'utf-8'))
          .then(response => {
            clearTimeout(timer)
            resolve(response.error_code === 0)
          })
          .catch(() => {
            clearTimeout(timer)
            resolve(false)
          })
      })
    }

    return Promise.resolve(false)
  }

  run(task: Task): void {
    this.isBusy = true
    const start = Date.now()
    let end = Date.now()

    // 这边使用Promise.resolve来构建async上下文，不能去掉
    Promise
      .resolve()
      .then(() => {
        return this.client.execute(this.sessionId, Buffer.from(task.command, 'utf-8'))
      })
      .then((response: any) => {
        // 清理executing timer
        if (task.executingTimer) {
          clearTimeout(task.executingTimer)
          task.executingTimer = null
        }

        end = Date.now()

        if (response.error_code !== 0) {
          throw new NebulaError(response.error_code, response.error_msg)
        }

        response.metrics = response.metrics ?? { execute: 0, traverse: 0 }
        const elapsed = end - start
        response.metrics.execute = elapsed

        if (!task.returnOriginalData) {
          return traverse(response)
        }
        return Promise.resolve(response)
      })
      .then((response: any) => {
        response.metrics.connectionId = this.connectionId

        task.resolve(response)
      })
      .catch((err: NodeJS.ErrnoException): void => {
        task.reject(err)
      })
      .finally(() => {
        this.isBusy = false
        this.emit('free', { sender: this })
      })
  }

  // 获取连接信息
  getConnectionInfo(): ConnectionInfo {
    return {
      connectionId: this.connectionId,
      host: this.connectionOption.host,
      port: this.connectionOption.port,
      space: this.connectionOption.space,
      isReady: this.isReady
    }
  }
}

