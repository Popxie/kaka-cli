/*
 * @Description: $: node inquirer-demo/expand.js
 * @Author: xiehuaqiang
 * @FilePath: /kaka-cli/inquirer-demo/expand.js
 * @Date: 2021-02-23 16:32:32
 */

const { chalk } = require('@vue/cli-shared-utils')
const inquirer = require('inquirer')

const questions = [

]

inquirer.prompt(questions).then(answers => {
  const receipt = chalk.bold.green('\nOrder receipt:')
  const answer = chalk.bold.green(JSON.stringify(answers, null, 2))
  console.log(receipt)
  console.log(answer)
})
