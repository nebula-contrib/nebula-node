/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/**
 * Created by Wu Jian Ping on - 2021/06/09.
 */


import _traverse from './traverse'

const traverse = (obj: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    setImmediate(() => {
      try {
        resolve(_traverse(obj))
      } catch (err) {
        reject(err)
      }
    })
  })
}

export default {
  traverse
}
