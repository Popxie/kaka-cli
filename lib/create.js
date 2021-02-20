/*
 * @Description: 
 * @Author: xiehuaqiang
 * @FilePath: /kaka-cli/lib/create.js
 * @Date: 2021-02-20 14:46:16
 */
const { chalk, error, stopSpinner, exit } = require('@vue/cli-shared-utils')
const { clearConsole } = require('./util/clearConsole')


async function create () {
  await clearConsole(true)
}

module.exports = (...args) => {
  return create(...args).catch(err => {
    stopSpinner(false) // do not persist
    error(err)
    if (!process.env.VUE_CLI_TEST) {
      process.exit(1)
    }
  })
}