/*
 * @Description: $: node inquirer-demo/editor.js
 * @Author: xiehuaqiang
 * @FilePath: /kaka-cli/inquirer-demo/editor.js
 * @Date: 2021-02-23 16:11:01
 */

const { chalk } = require('@vue/cli-shared-utils')
const inquirer = require('inquirer')

const questions = [
  {
    type: 'editor',
    name: 'bio',
    message: 'Please write a short bio of at least 3 lines.',
    validate: function (text) {
      if (text.split('\n').length < 3) {
        return 'Must be at least 3 lines.'
      }
      return true
    }
  }
]

inquirer.prompt(questions).then(answers => {
  const receipt = chalk.bold.green('\nOrder receipt:')
  const answer = chalk.bold.green(JSON.stringify(answers, null, 2))
  console.log(receipt)
  console.log(answer)
})
