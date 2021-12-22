/**
 * Created by Wu Jian Ping on 2017/3/20.
 **/

import { logger } from './libs/utils'

function run(task, options) {
  const start = new Date()
  logger.info(`Starting '${task.name}${options ? ` (${JSON.stringify(options)})` : ''}'...`)
  return task.func(options).then(() => {
    const end = new Date()
    const time = end.getTime() - start.getTime()
    logger.success(`Finished '${task.name}${options ? ` (${JSON.stringify(options)})` : ''}' after ${time} ms`)
  })
}

if (require.main === module && process.argv.length > 2) {
  delete require.cache[__filename]
  const module = require(`./${process.argv[2]}.js`)
  let task = module
  if (task.default) {
    task = module.default
  }
  run(task).catch((err) => {
    logger.error(err.stack || err) // eslint-disable-line
    process.exit(1)
  })
}

export default run
