/**
 * Created by Wu Jian Ping on - 2021/03/04.
 */

import { runNpmCli, getModuleDir, getModuleTempDir, getModuleDistDir, getConverageTsConfigFile, cowsay2, getModuleSourceDir } from './libs/utils'
import { makeDir, copyFile, cleanDir, copyDir } from './libs/fs'
import path from 'path'
import glob from 'glob'
import open from 'open'
import run from './run'
import build from './build'

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

const tsc = async () => {
  const buildDir = getModuleTempDir()
  await makeDir(buildDir)
  const tsConfigFile = path.join(buildDir, '.tsconfig.json')
  await copyFile(getConverageTsConfigFile(), tsConfigFile)

  await runNpmCli('tsc',
    [
      '--project',
      tsConfigFile,
      '--outDir',
      path.join(buildDir, 'tests')
    ],
    { cwd: getModuleDir() })
}

const coverage = {
  name: 'coverage',
  func: async () => {
    await cleanNYC()

    cowsay2('Starting generate coverage report...')

    await run(build)
    await tsc()
    await copyDir(getModuleDistDir(), path.join(getModuleTempDir(), 'dist'))
    await copyDir(getModuleSourceDir(), path.join(getModuleTempDir(), 'dist'), '**/*.ts')
    const files = glob.sync(path.join(getModuleTempDir(), 'tests', '*.test.js'))

    await runNpmCli('nyc', [
      '--silent',
      'mocha',
      ...files
    ])

    await runNpmCli('nyc', ['report'])

    open(path.join(process.cwd(), 'coverage', 'index.html'))
    return Promise.resolve()
  }
}

export default coverage
