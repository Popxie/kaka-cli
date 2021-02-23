/*
 * @Description: $: node inquirer-demo/list.js
 * @Author: xiehuaqiang
 * @FilePath: /kaka-cli/inquirer-demo/list.js
 * @Date: 2021-02-23 16:32:32
 */

const { chalk } = require('@vue/cli-shared-utils')
const inquirer = require('inquirer')

const questions = [
  {
    type: 'list',
    name: 'theme',
    message: 'What do you want to do?',
    choices: [
      'Order a pizza',
      'Make a reservation',
      new inquirer.Separator(),
      'Ask for opening hours',
      {
        name: 'Contact support',
        disabled: 'Unavailable at this time'
      },
      'Talk to the receptionist'
    ]
  },
  {
    type: 'list',
    name: 'size',
    message: 'What size do you need?',
    choices: ['Jumbo', 'Large', 'Standard', 'Medium', 'Small', 'Micro'],
    filter: function (val) {
      return val.toLowerCase()
    }
  }
]

inquirer.prompt(questions).then(answers => {
  const receipt = chalk.bold.green('\nOrder receipt:')
  const answer = chalk.bold.green(JSON.stringify(answers, null, 2))
  console.log(receipt)
  console.log(answer)
})
