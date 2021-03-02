/*
 * @Description:
 * @Author: xiehuaqiang
 * @FilePath: /kaka-cli/lib/create.js
 * @Date: 2021-02-20 14:46:16
 */
const inquirer = require('inquirer')
const path = require('path')
const { error, stopSpinner } = require('@vue/cli-shared-utils')
const { clearConsole } = require('./util/clearConsole')
const PackageManager = require('./util/ProjectPackageManager')
const { getPromptModules } = require('./util/createTools')
const PromptModuleAPI = require('./PromptModuleAPI')
const Generator = require('./Generator')

const isManualMode = answers => answers.preset === '__manual__'

const { presetPrompt, framePrompt, featurePrompt } = resolveIntroPrompts()

let promptInfo = {
  injectedPrompts: [],
  framePrompt,
  featurePrompt
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
        name: 'Manually select features',
        value: '__manual__'
      },
      {
        name: 'Default(Vue 2.x)',
        value: '__default__'
      }
    ]
  }
  const framePrompt = {
    name: 'frame',
    when: isManualMode,
    type: 'list',
    message: 'Check the project frame needed for your project:',
    choices: [],
    validate: function (answer) {
      if (!answer.includes('Vue')) {
        return 'You must choose a Vue version.'
      }
      return true
    },
  }


  const featurePrompt = {
    name: 'features',
    when: isManualMode,
    type: 'checkbox',
    message: 'Check the features needed for your project:',
    choices: [],
    validate: function (answer) {
      if (!answer.includes('Vue')) {
        return 'You must choose a Vue version.'
      }
      return true
    },
    pageSize: 10
  }

  return {
    presetPrompt,
    framePrompt,
    featurePrompt
  }
}

/**
 * 发起询问
 */
function resolveFinalPrompts () {
  promptInfo.injectedPrompts.forEach(prompt => {
    const originalWhen = prompt.when || (() => true)
    prompt.when = answers => {
      return isManualMode(answers) && originalWhen(answers)
    }
  })
  const prompts = [
    presetPrompt,
    framePrompt,
    featurePrompt,
    ...promptInfo.injectedPrompts,
  ]
  return prompts
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
    let newFeature
    if (feature === 'Vue' && answers.vueVersion === '2') {
      newFeature = 'vue2'
    } else if (feature === 'Vue' && answers.vueVersion === '3') {
      newFeature = 'vue3'
    } else {
      newFeature = feature
    }
    // 将answers传入到对应的index.js模块
    // eg: /kaka-cli/lib/enerator/router/index.js
    require(`./generator/${newFeature}`)(generator, answers)
  })

  await generator.generate()
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
