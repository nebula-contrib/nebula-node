/**
 * Created by Wu Jian Ping on - 2021/01/11.
 */

import { getModuleDir, runNpmCli, cowsay2 } from './libs/utils'
import path from 'path'
import fs from 'fs'
import glob from 'glob'

const test = {
  name: 'test',
  func: async () => {
    const currentTestsDir = getModuleDir()

    if (fs.existsSync(currentTestsDir)) {
      const files = glob.sync(path.join(currentTestsDir, 'tests', '**', '*.test.*'))
      if (files.length > 0) {
        cowsay2('Start testing...')

        await runNpmCli('mocha', [
          ...files
        ])
      }
    }
  }
}

export default test
