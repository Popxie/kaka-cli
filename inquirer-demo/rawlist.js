/*
 * @Description: $: node inquirer-demo/rawlist.js
 * @Author: xiehuaqiang
 * @FilePath: /kaka-cli/inquirer-demo/rawlist.js
 * @Date: 2021-02-23 15:59:02
 */

const { chalk } = require('@vue/cli-shared-utils')
const inquirer = require('inquirer')

/**
 * @param {Function} Separator 接收一个String, defaule: '-------'
 */
const questions = [
  {
    type: 'rawlist',
    name: 'theme',
    message: 'What do you want to do?',
    choices: [
      'Order a pizza',
      'Make a reservation',
      new inquirer.Separator(),
      'Ask opening hours',
      'Talk to the receptionist',
    ],
  },
  {
    type: 'rawlist',
    name: 'size',
    message: 'What size do you need',
    choices: ['Jumbo', 'Large', 'Standard', 'Medium', 'Small', 'Micro'],
    filter: function (val) {
      return val.toLowerCase();
    },
  }
]


inquirer.prompt(questions).then((answers) => {
  const receipt = chalk.bold.green('\nOrder receipt:')
  const answer = chalk.bold.green(JSON.stringify(answers, null, 2))
  console.log(receipt)
  console.log(answer);
})
