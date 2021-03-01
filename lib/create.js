/*
 * @Description:
 * @Author: xiehuaqiang
 * @FilePath: /kaka-cli/lib/create.js
 * @Date: 2021-02-20 14:46:16
 */
const inquirer = require('inquirer')
const path = require('path')
const { chalk, error, stopSpinner, exit } = require('@vue/cli-shared-utils')
const { clearConsole } = require('./util/clearConsole')
const PackageManager = require('./util/ProjectPackageManager')
const { getPromptModules } = require('./util/createTools')
const PromptModuleAPI = require('./PromptModuleAPI')
const Generator = require('./Generator')

const isManualMode = answers => answers.preset === '__manual__'

const { presetPrompt, featurePrompt } = resolveIntroPrompts()

let promptInfo = {
  injectedPrompts: [],
  featurePrompt,
  promptCompleteCbs: [],
  outroPrompts: resolveOutroPrompts()
}

const promptAPI = new PromptModuleAPI(promptInfo)

getPromptModules().forEach(m => m(promptAPI))

/**
 * 完成介绍提示
 */
function resolveIntroPrompts () {
  const presetPrompt = {
    name: 'preset',
    type: 'list',
    message: `Please pick a preset:`,
    choices: [
      {
        name: '其他',
        value: 'other'
      },
      {
        name: 'Manually select features',
        value: '__manual__'
      }
    ]
  }

  const featurePrompt = {
    name: 'features',
    when: isManualMode,
    type: 'checkbox',
    message: 'Check the features needed for your project:',
    choices: [],
    pageSize: 10
  }

  return {
    presetPrompt,
    featurePrompt
  }
}

/**
 * 结尾提示
 */
function resolveOutroPrompts () {
  const outroPrompts = [
    {
      name: 'useConfigFiles',
      when: isManualMode,
      type: 'list',
      message: 'Where do you prefer placing config for Babel, ESLint, etc.?',
      choices: [
        {
          name: 'In dedicated config files',
          value: 'files'
        },
        {
          name: 'In package.json',
          value: 'pkg'
        }
      ]
    },
    {
      name: 'save',
      when: isManualMode,
      type: 'confirm',
      message: 'Save this as a preset for future projects?',
      default: false
    },
    {
      name: 'saveName',
      when: answers => answers.save,
      type: 'input',
      message: 'Save preset as:'
    }
  ]
  return outroPrompts
}

function resolveFinalPrompts () {
  promptInfo.injectedPrompts.forEach(prompt => {
    const originalWhen = prompt.when || (() => true)
    prompt.when = answers => {
      return isManualMode(answers) && originalWhen(answers)
    }
  })
  const prompts = [
    presetPrompt,
    featurePrompt,
    ...promptInfo.injectedPrompts,
    ...promptInfo.outroPrompts,
  ]
  return prompts
}

function manualModePrompts () {
  return []
}

async function create (projectName) {
  const cwd = process.cwd()
  const targetDir = path.resolve(cwd, projectName || '.')

  await clearConsole(true)
  answers = await inquirer.prompt(resolveFinalPrompts())
  console.log('answers: ', answers)

  const pm = new PackageManager(targetDir, answers.packageManager)

  const pkg = {
    name: projectName,
    version: '0.1.0',
    dependencies: {},
    devDependencies: {},
  }
  const generator = new Generator(pkg, targetDir)

  answers.features.forEach(feature => {
    const f = feature === 'vueVersion' ? 'vue' : feature
    console.log('feature::::', feature)
    require(`./generator/${f}`)(generator, answers)
  })

  await generator.generate()
}


module.exports = (...args) => {
  console.log('args: ', args)
  return create(...args).catch(err => {
    stopSpinner(false) // do not persist
    error(err)
    if (!process.env.VUE_CLI_TEST) {
      process.exit(1)
    }
  })
}
