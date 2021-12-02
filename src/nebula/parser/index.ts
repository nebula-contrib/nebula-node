/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/**
 * Created by Wu Jian Ping on - 2021/06/09.
 */


import _traverse from './traverse'

const traverse = (obj: any): Promise<any> => {
  // 这边使用setImmediate替代直接函数调用, 以避免单个转换操作影响整体性能指标，注：不能使用process.nextTick
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
