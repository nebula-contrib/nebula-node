/**
 * Created by Wu Jian Ping on - 2021/03/05.
 */

import { getModuleDir, logger, runNpmCli } from './libs/utils'
import path from 'path'
import fs from 'fs'
import glob from 'glob'

const test = {
  name: 'dev module',
  func: async () => {
    const moduleDir = getModuleDir()
    let files = []
    if (fs.existsSync(moduleDir)) {
      files = glob.sync(path.join(moduleDir, 'tests', '**', '*.test.*'))
    }

    if (files.length > 0) {
      await runNpmCli('mocha', [
        ...files,
        '--reporter',
        'min',
        '--watch',
        '--watch-files',
        [moduleDir],
        '--watch-ignore',
        [path.join(moduleDir, 'node_modules')]
      ])
    } else {
      logger.info('Cannot found any unit test case, ignore! ')
    }
    return Promise.resolve()
  }
}

export default test
