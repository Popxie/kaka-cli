#!/usr/bin/env node

const { chalk, semver } = require('@vue/cli-shared-utils')
const program = require('commander')
const minimist = require('minimist')

program
  .version(`kaka-cli ${require('../package').version}`, '-v, --vers')
  .usage('<command> [options]')

program
  .command('create <app-name>')
  .description('create a new project powered by vue-cli-service')
  .action((name, option, cmd) => {
    console.log('name: ', name)
    const options = cleanArgs(cmd)
    console.log('options: ', options)
    if (minimist(process.argv.slice(3))._.length > 1) {
      console.log(chalk.yellow('\n Info: You provided more than one argument. The first one will be used as the app\'s name, the rest are ignored.'))
    }
    require('../lib/create')(name, options)
  })
// 最后执行
program.parse(process.argv)

const options = program.opts()

/**
 * 将连字符命名的转为驼峰格式
 * @param {*} str  x-y-z => xYZ
 */
function camelize (str) {
  return str.replace(/-(\w)/g, (match, group) => group ? group.toUpperCase() : '')
}

/**
 * commander将Command对象本身作为选项传递
 * 将实际的选项提取到一个新对象中(args)。
 * @param {Object} cmd  command实例
 */
function cleanArgs (cmd) {
  const args = {}
  cmd.options.forEach(o => {
    const key = camelize(o.long.replace(/^--/, ''))
    // if an option is not present and Command has a method with the same name
    // it should not be copied
    if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
      args[key] = cmd[key]
    }
  })
  console.log('cleanArgs => args: ', args)
  return args
}