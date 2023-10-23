/**
 * Created by Wu Jian Ping on - 2021/06/09.
 */

import Client from './Client'
import Connection from './Connection'
import { ConnectionOption, ClientOption } from './types'
import * as parser from './parser'

const createClient = (option: ClientOption): Client => new Client(option)

export default createClient

export {
  createClient,
  ClientOption,
  Client,
  Connection,
  ConnectionOption,
  parser
}
