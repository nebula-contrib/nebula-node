/**
 * Created by Wu Jian Ping on - 2021/01/07.
 */

import fs from 'fs'
import path from 'path'
import glob from 'glob'
import mkdirp from 'mkdirp'
import rimraf from 'rimraf'

const readFile = file => new Promise((resolve, reject) => {
  fs.readFile(file, 'utf8', (err, data) => (err ? reject(err) : resolve(data)))
})

const writeFile = (file, contents) => new Promise((resolve, reject) => {
  fs.writeFile(file, contents, 'utf8', err => (err ? reject(err) : resolve()))
})

const copyFile = (source, target) => new Promise((resolve, reject) => {
  const stats = fs.statSync(source)
  if (stats && stats.isDirectory()) { // if dir return
    resolve()
    return
  }

  let cbCalled = false

  function done(err) {
    if (!cbCalled) {
      cbCalled = true
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    }
  }

  const rd = fs.createReadStream(source)
  rd.on('error', err => done(err))
  const wr = fs.createWriteStream(target)
  wr.on('error', err => done(err))
  wr.on('close', err => done(err))
  rd.pipe(wr)
})

const readDir = (pattern, options) => new Promise((resolve, reject) => glob(pattern, options, (err, result) => (err ? reject(err) : resolve(result))))

const makeDir = name => new Promise((resolve, reject) => {
  mkdirp(name, err => (err ? reject(err) : resolve()))
})

const copyDir = async (source, target, parten = '**/*.*') => {
  const dirs = await readDir(parten, {
    cwd: source,
    nosort: true,
    dot: true
  })
  await Promise.all(dirs.map(async (dir) => {
    const from = path.resolve(source, dir)
    const to = path.resolve(target, dir)
    await makeDir(path.dirname(to))
    await copyFile(from, to)
  }))
}

const cleanDir = (pattern, options) => new Promise((resolve, reject) => rimraf(pattern, {
  glob: options
}, (err, result) => (err ? reject(err) : resolve(result))))

export {
  readFile,
  writeFile,
  copyFile,
  readDir,
  makeDir,
  copyDir,
  cleanDir
}

export default {
  readFile,
  writeFile,
  copyFile,
  readDir,
  makeDir,
  copyDir,
  cleanDir
}
