const stripAnsi = require('strip-ansi')
const { execa, hasProjectYarn, hasProjectNpm, log } = require('@vue/cli-shared-utils')

const { executeCommand } = require('./executeCommand')

const registries = require('./registries')
const shouldUseTaobao = require('./shouldUseTaobao')

const PACKAGE_MANAGER_CONFIG = {
  npm: {
    install: ['install', '--loglevel', 'error']
  },
  yarn: {
    install: []
  }
}

class PackageManager {
  constructor({ context, packageManager } = {}) {
    this.context = context || process.cwd()
    this._registries = {}

    if (packageManager) {
      this.bin = packageManager
    } else if (context) {
      if (hasProjectYarn(context)) {
        this.bin = 'yarn'
      } else if (hasProjectNpm(context)) {
        this.bin = 'npm'
      }
    }
  }

  async setRegistryEnvs() {
    const cacheKey = ''
    if (this._registries[cacheKey]) {
      return this._registries[cacheKey]
    }
    let registry
    if (await shouldUseTaobao(this.bin)) {
      registry = registries.taobao
    } else {
      try {
        // npm config get registry || yarn config get registry
        if (!registry || registry === 'undefined') {
          registry = (await execa(this.bin, ['config', 'get', 'registry'])).stdout
        }
      } catch (e) {
        // Yarn 2 uses `npmRegistryServer` instead of `registry`
        registry = (await execa(this.bin, ['config', 'get', 'npmRegistryServer'])).stdout
      }
    }

    this._registries[cacheKey] = stripAnsi(registry).trim()
    return this._registries[cacheKey]
  }

  async runCommand(command, args) {
    await this.setRegistryEnvs()
    return await executeCommand(
      this.bin,
      [...PACKAGE_MANAGER_CONFIG[this.bin][command], ...(args || [])],
      this.context
    )
  }

  async install() {
    log('\n正在下载依赖...\n')
    return await this.runCommand('install')
  }
}

module.exports = PackageManager
