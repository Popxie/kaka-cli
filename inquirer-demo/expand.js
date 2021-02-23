/*
 * @Description: $: node inquirer-demo/expand.js
 * @Author: xiehuaqiang
 * @FilePath: /kaka-cli/inquirer-demo/expand.js
 * @Date: 2021-02-23 16:32:32
 */

const { chalk } = require('@vue/cli-shared-utils')
const inquirer = require('inquirer')

const questions = [
  {
    type: 'expand',
    message: 'Conflict on `file.js`: ',
    name: 'overwrite',
    choices: [
      {
        key: 'y',
        name: 'Overwrite',
        value: 'overwrite'
      },
      {
        key: 'a',
        name: 'Overwrite this one and all next',
        value: 'overwrite_all'
      },
      {
        key: 'd',
        name: 'Show diff',
        value: 'diff'
      },
      new inquirer.Separator(),
      {
        key: 'x',
        name: 'Abort',
        value: 'abort'
      }
    ]
  }
]

inquirer.prompt(questions).then(answers => {
  const receipt = chalk.bold.green('\nOrder receipt:')
  const answer = chalk.bold.green(JSON.stringify(answers, null, 2))
  console.log(receipt)
  console.log(answer)
})
