/*
 * @Description:
 * @Author: xiehuaqiang
 * @FilePath: \kaka-cli\lib\Generator.js
 * @Date: 2021-02-26 11:19:49
 */

const ejs = require('ejs')
const normalizeFilePaths = require('./util/normalizeFilePaths')

const ConfigTransform = require('./ConfigTransform')



module.exports = class Generator {
  /**
   * @param {*} context 当前项目路径
   * @param {*} pkg package.json的相关信息
   */
  constructor (context, pkg) {
    this.this.context = context
    this.originalPkg =  pkg
    this.pkg = Object.assign({}, pkg)
    this.files = {}
  }
  async generate () {
    // wait for file resolve
    await this.resolveFiles()
  }
  async resolveFiles () {
    const files = this.files
    for (const middleware of this.fileMiddlewares) {
      await middleware(files, ejs.render)
    }
    // 将反斜杠 \ 转换为正斜杠 /
    normalizeFilePaths(files)
  }
}
