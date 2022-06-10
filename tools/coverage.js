/**
 * Created by Wu Jian Ping on - 2021/03/04.
 */

import { cleanDir, copyDir, copyFile, makeDir } from './libs/fs'
import { cowsay2, getConverageTsConfigFile, getModuleDir, getModuleDistDir, getModuleSourceDir, getModuleTempDir, runNpmCli } from './libs/utils'

import build from './build'
import glob from 'glob'
// import open from 'open'
import path from 'path'
import run from './run'

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
    cowsay2('Starting generate coverage report...')

    await cleanNYC()
    await run(build)
    await tsc()
    await copyDir(getModuleDistDir(), path.join(getModuleTempDir(), 'dist'))
    await copyDir(getModuleSourceDir(), path.join(getModuleTempDir(), 'dist'), '**/*.ts')
    const files = glob.sync(path.join(getModuleTempDir(), 'tests', '*.test.js'))

    await runNpmCli('nyc', [
      '--silent',
      'mocha',
      `--config=${path.join(process.cwd(), '.mocharc.nyc.json')}`,
      ...files
    ])

    await runNpmCli('nyc', ['report'])

    // open(path.join(process.cwd(), 'coverage', 'index.html'))

    return Promise.resolve()
  }
}

export default coverage
