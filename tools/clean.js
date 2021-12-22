/**
 * Created by Wu Jian Ping on - 2021/01/07.
 */

import { cleanDir } from './libs/fs'
import { getCacheDir } from './libs/utils'

const cleanDist = async () => {
  await cleanDir('./dist', {
    nosort: true,
    dot: true
  })
}

const cleanTemp = async () => {
  await cleanDir('./.tmp', {
    nosort: true,
    dot: true
  })
}

const cleanCache = async () => {
  await cleanDir(getCacheDir(), {
    nosort: true,
    dot: true
  })
}

const cleanNYC = async () => {
  await cleanDir('./coverage', {
    nosort: true,
    dot: true
  })

  await cleanDir('./.nyc_output', {
    nosort: true,
    dot: true
  })
}

const clean = async () => {
  await cleanTemp()
  await cleanDist()
  await cleanCache()
  await cleanNYC()
}

export {
  cleanTemp,
  cleanDist,
  cleanCache
}

export default {
  name: 'clean',
  func: clean
}
