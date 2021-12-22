/**
 * Created by Wu Jian Ping on - 2021/01/07.
 */

import _ from 'lodash'
import path from 'path'
import glob from 'glob'
import fs from 'fs'

import run from './run'
import { getBuildStage0Dir, getBuildTsConfigFile, runNpmCli, getBuildStage1Dir, getModuleDistDir } from './libs/utils'
import clean, { cleanTemp } from './clean'
import { copyFile, makeDir } from './libs/fs'
import { copyDeclarationFiles, copyMarkdown, copyNative, copyThrift, generatePackageJson, copyNpmIngoreFile } from './copy'

const fsPromise = fs.promises

const buildStage0 = {
  name: 'stage-0',
  func: async () => {
    const buildDir = getBuildStage0Dir()
    await makeDir(buildDir)
    const tsConfigFile = path.join(getBuildStage0Dir(), '.tsconfig.json')
    await copyFile(getBuildTsConfigFile(), tsConfigFile)

    await runNpmCli('tsc',
      [
        '--project',
        tsConfigFile,
        '--outDir',
        buildDir
      ]
    )
  }
}

const buildStage1 = {
  name: 'stage-1',
  func: async () => {
    await runNpmCli('babel', [
      getBuildStage0Dir(),
      '-d',
      getBuildStage1Dir(),
      '--config-file',
      './tools/configs/babel.config.json',
      '--source-maps',
      '--no-babelrc'
    ])
  }
}

const buildStage2 = {
  name: 'stage-2',
  func: async () => {
    const sourceMaps = glob.sync(path.join(getModuleDistDir(), '**', '*.js.map'))

    const tasks = _.map(sourceMaps, async file => {
      const content = await fsPromise.readFile(file, { encoding: 'utf-8' })
      const obj = JSON.parse(content)
      if (_.isArray(obj?.sources) && obj.sources.length > 0) {
        obj.sources = _.map(obj.sources, o => path.basename(o))
        await fsPromise.writeFile(file, JSON.stringify(obj))
      }
    })

    await Promise.all(tasks)
  }
}

const build = {
  name: 'build',
  func: async () => {
    // clean
    await run(clean)

    // stage-0: tsc
    await run(buildStage0)

    // stage-1: babel
    await run(buildStage1)

    // copy ts declaration files
    await run(copyDeclarationFiles)

    // copy markdown file(s)
    await run(copyMarkdown)

    // copy native source code
    await run(copyNative)

    // copy modified thrift
    await run(copyThrift)

    // generate package.json
    await run(generatePackageJson)

    // fix source map for compatible with source-map-support module
    await run(buildStage2)

    // build native module
    await runNpmCli('node-gyp', ['rebuild'], { cwd: getModuleDistDir() }, true)

    // add npm ignore file
    await run(copyNpmIngoreFile)

    // clean .tmp
    await cleanTemp()
  }
}

export {
  buildStage0,
  buildStage1,
  buildStage2,
  build
}

export default build
