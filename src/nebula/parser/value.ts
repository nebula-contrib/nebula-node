/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/**
 * Created by Wu Jian Ping on - 2021/06/10.
 */

import Int64 from 'node-int64'
import native from '../../native'

export default (obj: any, propName: string): any => {
  // for i64
  const v = obj[propName]
  if (v instanceof Int64) {
    if (isFinite(v.valueOf())) {
      return +v.toString()
    } else {
      if (v.buffer) {
        return native.bytesToLongLongString(v.buffer as any)
      }
      return v.toOctetString()
    }
  }
  return v
}
