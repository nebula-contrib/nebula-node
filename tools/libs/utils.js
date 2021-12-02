/**
 * Created by Wu Jian Ping on - 2021/01/06.
 */

import chalk from 'chalk'
import path from 'path'
import { spawn } from 'child_process'
import _ from 'lodash'
import which from 'which'
import cowsay from 'cowsay'

const formatTime = (time) => {
  return time.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '[$1] ')
}

const print = (msg, colorFunc) => {
  if (_.isString(msg) && msg) {
    if (msg.endsWith('\r\n')) {
      msg = msg.substr(0, msg.length - 2)
    }
    if (msg.endsWith('\n')) {
      msg = msg.substr(0, msg.length - 1)
    }
    msg = msg.replace(/\r\n/ig, '\n')
  }
  msg = (msg ?? '').toString()
  const messageList = _.split(msg, '\n')
  for (let i = 0; i < messageList.length; ++i) {
    if (messageList[i]) {
      console.log(`${formatTime(new Date())}${colorFunc(messageList[i])}`) //eslint-disable-line
    }
  }
}

/**
 * logger
 */
const logger = {
  success: (msg) => {
    print(msg, chalk.greenBright)
  },
  error: (msg) => {
    print(msg, chalk.redBright)
  },
  info: (msg) => {
    print(msg, chalk.blueBright)
  },
  debug: (msg) => {
    print(msg, chalk.yellowBright)
  }
}

/**
 * get command path
 * @param {String} cliName
 */
const getNpmCli = cliName => {
  const cmd = process.platform === 'win32' ? `${cliName}.cmd` : cliName
  return path.join(process.cwd(), 'node_modules', '.bin', cmd)
}

const getModuleDir = () => {
  return process.cwd()
}

const getModuleSourceDir = () => {
  return path.join(getModuleDir(), 'src')
}

const getModuleDistDir = () => {
  return path.join(getModuleDir(), 'dist')
}

const getModuleTempDir = () => {
  return path.join(getModuleDir(), '.tmp')
}

const getBuildStageDir = (stage) => {
  return path.join(getModuleDir(), '.tmp', stage)
}

const getBuildStage0Dir = () => {
  return getBuildStageDir('stage-0')
}

const getBuildStage1Dir = () => {
  return getModuleDistDir()
}

const getBuildTsConfigFile = () => {
  return path.join(process.cwd(), 'tools', 'configs', 'build.tsconfig.json')
}

const getConverageTsConfigFile = () => {
  return path.join(process.cwd(), 'tools', 'configs', 'coverage.tsconfig.json')
}

const runNpmCli = (cli, params, options = {}, global = false, silence = false, ignoreExitCode = false) => {
  return new Promise((resolve, reject) => {
    let bin = ''

    if (global) {
      bin = path.basename(which.sync(cli))
      // bin = which.sync(cli)
    } else {
      bin = getNpmCli(cli)
    }

    if (!silence) {
      options.stdio = 'inherit'
    }

    const exec = spawn(bin, params, options)

    exec.on('close', (code) => {
      if (ignoreExitCode) {
        resolve()
      } else {
        if (code === 0) {
          resolve()
        } else {
          reject(new Error(`child process exited with code ${code}`))
        }
      }
    })
  })
}

// get babel cache dir
const getCacheDir = () => {
  return path.join(process.cwd(), 'node_modules', '.cache')
}

const cowsay2 = message => {
  console.log(cowsay.say({ // eslint-disable-line
    text: message
  }))
}


export default {
  logger,
  getNpmCli,
  getModuleDir,
  getModuleSourceDir,
  getModuleDistDir,
  getModuleTempDir,
  getBuildTsConfigFile,
  getConverageTsConfigFile,
  getBuildStageDir,
  getBuildStage0Dir,
  getBuildStage1Dir,
  runNpmCli,
  getCacheDir,
  cowsay2
}

export {
  logger,
  getNpmCli,
  getModuleDir,
  getModuleSourceDir,
  getModuleDistDir,
  getModuleTempDir,
  getBuildTsConfigFile,
  getConverageTsConfigFile,
  getBuildStageDir,
  getBuildStage0Dir,
  getBuildStage1Dir,
  runNpmCli,
  getCacheDir,
  cowsay2
}
