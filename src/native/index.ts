/**
 * Created by Wu Jian Ping on - 2021/06/15.
 */

import _ from 'lodash'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const addon = require('bindings')('addon')

const bytesToLongLongString = (buffer: number[]): string => {
  const tmp = _.reverse(buffer)
  return addon.bytesToLongLongString(...tmp)
}

const hash64 = (key: string): string[] => {
  return addon.hash64(key)
}

export default {
  bytesToLongLongString,
  hash64
}

export {
  bytesToLongLongString,
  hash64
}
