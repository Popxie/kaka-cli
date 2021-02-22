/*
 * @Description:
 * @Author: xiehuaqiang
 * @FilePath: /kaka-cli/lib/create.js
 * @Date: 2021-02-20 14:46:16
 */
const inquirer = require('inquirer')
const { chalk, error, stopSpinner, exit } = require('@vue/cli-shared-utils')
const { clearConsole } = require('./util/clearConsole')

function resolveFinalPrompts () {
  return [
    {
      name: 'preset',
      type: 'list',
      message: 'Please pick a preset:',
      choices: [
        {
          name: 'VUE 2.X',
          value: 'vue2'
        },
        {
          name: 'VUE 3.X',
          value: 'vue3'
        },
      ]
    }
  ]
}

async function create () {
  await clearConsole(true)
  answers = await inquirer.prompt(resolveFinalPrompts())
  console.log('answers: ', answers)
  // let preset

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
