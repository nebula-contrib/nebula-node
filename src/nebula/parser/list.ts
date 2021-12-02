/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

/**
 * Created by Wu Jian Ping on - 2021/06/10.
 */

export default (obj: any, propName: string): any => {
  return obj[propName].values || []
}

