/*
 * @Description:
 * @Author: xiehuaqiang
 * @FilePath: /kaka-cli/lib/util/clearConsole.js
 * @Date: 2021-02-20 14:54:51
 */
const {
  chalk,
  execa,
  semver,
  clearConsole,
  hasYarn,
  hasPnpm3OrLater
} = require('@vue/cli-shared-utils')

async function getInstallationCommand () {
  if (hasYarn()) {
    const { stdout: yarnGlobalDir } = await execa('yarn', ['global', 'dir'])
    if (__dirname.includes(yarnGlobalDir)) {
      return 'yarn global add'
    }
  }

  if (hasPnpm3OrLater()) {
    const { stdout: pnpmGlobalPrefix } = await execa('pnpm', ['config', 'get', 'prefix'])
    if (__dirname.includes(pnpmGlobalPrefix) && __dirname.includes('pnpm-global')) {
      return `pnpm i -g`
    }
  }

  const res= await execa('npm', ['config', 'get', 'prefix'])
  console.log('res: ', res)
  console.log('__dirname: ', __dirname)
  const { stdout: npmGlobalPrefix } = await execa('npm', ['config', 'get', 'prefix'])

  if (__dirname.includes(npmGlobalPrefix)) {
    return `npm i -g`
  }
}

/**
 * @param {Boolean} checkUpdate
 */
exports.generateTitle = async function (checkUpdate) {
  // const { current, latest, error } = await getVersions()
  const current = '1.0.1'
  const latest = '1.1.0'
  let error = ''
  let title = chalk.bold.blue(`KaKa CLI v${current}`)

  if (process.env.VUE_CLI_TEST) {
    title += ` ${chalk.blue.bold('TEST')}`
  }

  if (process.env.VUE_CLI_DEBUG) {
    title += ` ${chalk.magenta.bold('DEBUG')}`
  }

  if (error) {
    title += '\n' + chalk.red('Failed to check for updates')
  }

  // gt 是否 大于（＞）
  if (checkUpdate && !error && semver.gt(latest, current)) {
    let upgradeMessage = `New version available ${chalk.magenta(current)} → ${chalk.green(latest)}`

    try {
      const command = await getInstallationCommand()
      let name = require('../../package.json').name
      if (command) {
        upgradeMessage += `\nRun ${chalk.yellow(`${command} ${name}`)} to update!`
      }
    } catch (e) {}

    const upgradeBox = require('boxen')(upgradeMessage, {
      align: 'center',
      borderColor: 'green',
      dimBorder: true,
      padding: 1
    })

    title += `\n${upgradeBox}\n`
  }

  return title
}
exports.clearConsole = async function clearConsoleWithTitle (checkUpdate) {
  console.log('checkUpdate: ', checkUpdate)
  const title = await exports.generateTitle(checkUpdate)
  clearConsole(`${title}`)
}
