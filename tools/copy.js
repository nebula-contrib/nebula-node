/**
 * Created by Wu Jian Ping on - 2021/01/07.
 */

import { makeDir, copyDir, writeFile } from './libs/fs'
import { getModuleDir, getModuleDistDir, getBuildStage0Dir, getModuleSourceDir } from './libs/utils'
import path from 'path'
import _ from 'lodash'

/**
 * copy declaration files
 */
const copyDeclarationFiles = {
  name: 'copy declaration filelse(s)',
  func: async () => {
    await makeDir(getModuleDistDir())
    // declaration files generated at stage-0
    await copyDir(getBuildStage0Dir(), getModuleDistDir(), '**/*.d.ts')
  }
}

/**
 * copy markdown
 */
const copyMarkdown = {
  name: 'copy markdown file(s)',
  func: async () => {
    await makeDir(getModuleDistDir())
    await copyDir(getModuleDir(), getModuleDistDir(), '*.md')
  }
}

const copyNative = {
  name: 'copy C++ source file(s)',
  func: async () => {
    await makeDir(getModuleDistDir())
    await copyDir(getModuleSourceDir(), getModuleDistDir(), 'binding.gyp')
    await copyDir(getModuleSourceDir(), getModuleDistDir(), '**/*.cc')
    await copyDir(getModuleSourceDir(), getModuleDistDir(), '**/*.h')
    await copyDir(getModuleSourceDir(), getModuleDistDir(), '**/*.cpp')
  }
}

const copyThrift = {
  name: 'copy thrift',
  func: async () => {
    await makeDir(getModuleDistDir())
    await copyDir(path.join(getModuleSourceDir(), 'thrift'), path.join(getModuleDistDir(), 'thrift'))
  }
}

const generatePackageJson = {
  name: 'generate package.json',
  func: async () => {
    await makeDir(getModuleDistDir())
    const packageJson = require('../package.json')
    await writeFile(path.join(getModuleDistDir(), 'package.json'), JSON.stringify(_.omit(packageJson, ['scripts', 'devDependencies']), null, 2))
  }
}

export {
  copyDeclarationFiles,
  copyMarkdown,
  copyNative,
  copyThrift,
  generatePackageJson
}
