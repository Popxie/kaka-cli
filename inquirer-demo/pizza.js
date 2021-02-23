/*
 * @Description: $: node inquirer-demo/pizza.js
 * @Author: xiehuaqiang
 * @FilePath: /kaka-cli/inquirer-demo/pizza.js
 * @Date: 2021-02-23 14:49:16
 */
const { chalk } = require('@vue/cli-shared-utils')
const inquirer = require('inquirer')

const welcome = chalk.bold.blue('\nHi, welcome to Node Pizza \n')
console.log(welcome)

const questions = [
  { // 第一步
    type: 'confirm',
    name: 'toBeDelivered',
    message: 'Is this for delivery?',
    default: true,
  },
  { // 第二步
    type: 'input',
    name: 'phone',
    message: "What's your phone number?",
    default: 15258685333,
    validate: function (value) {
      // const rule = /^([01]{1})?[-.\s]?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})\s?((?:#|ext\.?\s?|x\.?\s?){1}(?:\d+)?)?$/i
      // const warnning = chalk.bold.red('\nPlease enter a valid phone number')
      // const pass = value.match(rule)
      // if (!pass) return console.log(warnning)
      return true
    }
  },
  { // 第三步
    type: 'list',
    name: 'size',
    message: 'What size do you need?',
    choices: ['Large', 'Medium', 'Small'],
    filter: function (val) {
      return val.toLowerCase();
    }
  },
  { // 第四步
    type: 'input',
    name: 'quantity',
    message: 'How many do you need?',
    validate: function (value) {
      var valid = !isNaN(parseFloat(value));
      return valid || 'Please enter a number';
    },
    filter: Number,
  },
  {
    type: 'expand',
    name: 'toppings',
    message: 'What about the toppings?',
    choices: [
      {
        key: 'p',
        name: 'Pepperoni and cheese',
        value: 'PepperoniCheese',
      },
      {
        key: 'a',
        name: 'All dressed',
        value: 'alldressed',
      },
      {
        key: 'w',
        name: 'Hawaiian',
        value: 'hawaiian',
      }
    ]
  },
  {
    type: 'rawlist',
    name: 'beverage',
    message: 'You also get a free 2L beverage',
    choices: ['Pepsi', '7up', 'Coke'],
  },
  {
    type: 'input',
    name: 'comments',
    message: 'Any comments on your purchase experience?',
    default: 'Nope, all good!',
  },
  {
    type: 'list',
    name: 'prize',
    message: 'For leaving a comment, you get a freebie',
    choices: ['cake', 'fries'],
    when: function (answers) {
      // true设置该选项，反之不跳过
      return answers.comments !== 'Nope, all good!'
    }
  },
]

inquirer.prompt(questions).then((answers) => {
  const receipt = chalk.bold.green('\nOrder receipt:')
  const answer = chalk.bold.green(JSON.stringify(answers, null, 2))
  console.log(receipt)
  console.log(answer);
})
