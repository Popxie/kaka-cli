/*
 * @Description: $: node inquirer-demo/checkbox.js
 * @Author: xiehuaqiang
 * @FilePath: /kaka-cli/inquirer-demo/checkbox.js
 * @Date: 2021-02-23 16:11:01
 */

const { chalk } = require('@vue/cli-shared-utils')
const inquirer = require('inquirer')

const questions = [
  {
    type: 'checkbox',
    message: 'Select toppings',
    name: 'toppings',
    choices: [
      new inquirer.Separator(' = The Meats = '),
      {
        name: 'Pepperoni'
      },
      {
        name: 'Ham'
      },
      {
        name: 'Ground Meat'
      },
      {
        name: 'Bacon'
      },
      new inquirer.Separator(' = The Cheeses = '),
      {
        name: 'Mozzarella',
        checked: true
      },
      {
        name: 'Cheddar'
      },
      {
        name: 'Parmesan'
      },
      new inquirer.Separator(' = The usual ='),
      {
        name: 'Mushroom'
      },
      {
        name: 'Tomato'
      },
      new inquirer.Separator(' = The extras = '),
      {
        name: 'Pineapple'
      },
      {
        name: 'Olives',
        disabled: 'out of stock'
      },
      {
        name: 'Extra cheese'
      }
    ],
    validate: function (answer) {
      if (answer.length < 3) {
        return 'You must choose at least three topping.'
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
