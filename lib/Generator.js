/*
 * @Description:
 * @Author: xiehuaqiang
 * @FilePath: /kaka-cli/lib/Generator.js
 * @Date: 2021-02-26 11:19:49
 */
const fs = require('fs-extra')
const path = require('path')
const ejs = require('ejs')
const { isBinaryFileSync } = require('isbinaryfile')

const normalizeFilePaths = require('./util/normalizeFilePaths')
const sortObject = require('./util/sortObject')
const writeFileTree = require('./util/writeFileTree')
const runCodemod = require('./util/runCodemod')

const ConfigTransform = require('./ConfigTransform')

const isObject = val => val && typeof val === 'object'

const defaultConfigTransforms = {
  babel: new ConfigTransform({
    file: {
      js: ['babel.config.js']
    }
  }),
  postcss: new ConfigTransform({
    file: {
      js: ['postcss.config.js'],
      json: ['.postcssrc.json', '.postcssrc'],
      yaml: ['.postcssrc.yaml', '.postcssrc.yml']
    }
  }),
  eslintConfig: new ConfigTransform({
    file: {
      js: ['.eslintrc.js'],
      json: ['.eslintrc', '.eslintrc.json'],
      yaml: ['.eslintrc.yaml', '.eslintrc.yml']
    }
  }),
  jest: new ConfigTransform({
    file: {
      js: ['jest.config.js']
    }
  }),
  browserslist: new ConfigTransform({
    file: {
      lines: ['.browserslistrc']
    }
  })
}

const reservedConfigTransforms = {
  vue: new ConfigTransform({
    file: {
      js: ['vue.config.js']
    }
  })
}
const ensureEOL = str => {
  if (str.charAt(str.length - 1) !== '\n') {
    return str + '\n'
  }
  return str
}
module.exports = class Generator {
  /**
   * @param {*} context 当前项目路径
   * @param {*} pkg package.json的相关信息
   */
  constructor(pkg, context) {
    this.context = context
    this.fileMiddlewares = []
    this.originalPkg = pkg
    this.entryFile = `src/main.js`
    this.pkg = Object.assign({}, pkg)
    this.files = {}
    this.imports = {}
    this.rootOptions = {}
    this.options = {}
  }
  extendPackage(fields) {
    const pkg = this.pkg
    for (const key in fields) {
      const value = fields[key]
      const existing = pkg[key]
      if (
        isObject(value) &&
        (key === 'dependencies' || key === 'devDependencies' || key === 'scripts')
      ) {
        pkg[key] = Object.assign(existing || {}, value)
      } else {
        pkg[key] = value
      }
    }
  }
  async generate() {
    // 从 package.json 中提取文件
    this.extractConfigFiles()
    // wait for file resolve 等待文件解析
    await this.resolveFiles()
    // 将 package.json 中的字段排序
    this.sortPkg()
    console.log('this.pkg: ', this.pkg)
    this.files['package.json'] = JSON.stringify(this.pkg, null, 2) + '\n'
    // 将所有文件写入到用户要创建的目录
    await writeFileTree(this.context, this.files)
  }
  extractConfigFiles() {
    const configTransforms = {
      ...defaultConfigTransforms,
      ...this.configTransforms,
      ...reservedConfigTransforms
    }
    const extract = key => {
      if (configTransforms[key] && this.pkg[key]) {
        const value = this.pkg[key]
        const configTransform = configTransforms[key]
        const res = configTransform.transform(value, this.files, this.context)

        const { content, filename } = res
        // 如果文件不是以 \n 结尾，则补上 \n
        this.files[filename] = ensureEOL(content)
        delete this.pkg[key]
      }
    }

    extract('vue')
    extract('babel')
  }

  sortPkg() {
    // ensure package.json keys has readable order
    this.pkg.dependencies = sortObject(this.pkg.dependencies)
    this.pkg.devDependencies = sortObject(this.pkg.devDependencies)
    this.pkg.scripts = sortObject(this.pkg.scripts, [
      'serve',
      'build',
      'test:unit',
      'test:e2e',
      'lint',
      'deploy'
    ])
    this.pkg = sortObject(this.pkg, [
      'name',
      'version',
      'private',
      'description',
      'author',
      'scripts',
      'main',
      'module',
      'browser',
      'jsDelivr',
      'unpkg',
      'files',
      'dependencies',
      'devDependencies',
      'peerDependencies',
      'vue',
      'babel',
      'eslintConfig',
      'prettier',
      'postcss',
      'browserslist',
      'jest'
    ])
  }
  /**
   * 获取文件
   */
  async resolveFiles() {
    const files = this.files
    for (const middleware of this.fileMiddlewares) {
      await middleware(files, ejs.render)
    }
    // 将反斜杠 \ 转换为正斜杠 /
    normalizeFilePaths(files)
    // 处理 import 语句的导入和 new Vue() 选项的注入
    // vue-codemod 库，对代码进行解析得到 AST，再将 import 语句和根选项注入
    Object.keys(files).forEach(file => {
      let imports = this.imports[file]
      imports = imports instanceof Set ? Array.from(imports) : imports
      if (imports && imports.length > 0) {
        const transformModule = require('./util/codemods/injectImports')
        const fileInfo = { path: file, source: files[file] }
        files[file] = runCodemod(transformModule, fileInfo, { imports })
      }
      let injections = this.rootOptions[file]
      injections = injections instanceof Set ? Array.from(injections) : injections
      if (injections && injections.length > 0) {
        const transformModule = require('./util/codemods/injectOptions')
        const fileInfo = { path: file, source: files[file] }
        files[file] = runCodemod(transformModule, fileInfo, { injections })
      }
    })
  }
  /**
   * 渲染
   * @param {*} source
   * @param {*} additionalData
   * @param {*} ejsOptions
   */
  render(source, additionalData = {}, ejsOptions = {}) {
    console.log('additionalData: ', additionalData)
    // 获取调用 generator.render() 函数的文件的父目录路径
    const baseDir = extractCallDir()
    source = path.resolve(baseDir, source)
    this._injectFileMiddleware(async files => {
      const data = this._resolveData(additionalData)
      console.log('\ndata::::: ', data, '\n')
      // https://github.com/sindresorhus/globby
      const globby = require('globby')
      // 读取目录中所有的文件
      const _files = await globby(['**/*'], { cwd: source, dot: true })
      for (const rawPath of _files) {
        const sourcePath = path.resolve(source, rawPath)
        // 解析文件内容
        const content = this.renderFile(sourcePath, data, ejsOptions)
        // only set file if it's not all whitespace, or is a Buffer (binary files)
        if (Buffer.isBuffer(content) || /[^\s]/.test(content)) {
          files[rawPath] = content
        }
      }
    })
  }
  _injectFileMiddleware(middleware) {
    this.fileMiddlewares.push(middleware)
  }
  // 合并选项
  _resolveData(additionalData) {
    return {
      options: this.options,
      rootOptions: this.rootOptions,
      ...additionalData
    }
  }
  renderFile(name, data, ejsOptions) {
    // 如果是二进制文件，直接将读取结果返回
    if (isBinaryFileSync(name)) {
      return fs.readFileSync(name) // return buffer
    }

    // 返回文件内容
    const template = fs.readFileSync(name, 'utf-8')
    return ejs.render(template, data, ejsOptions)
  }
  /**
   * Add import statements to a file.
   */
  injectImports(file, imports) {
    const _imports = this.imports[file] || (this.imports[file] = new Set())
    ;(Array.isArray(imports) ? imports : [imports]).forEach(imp => {
      _imports.add(imp)
    })
  }

  /**
   * Add options to the root Vue instance (detected by `new Vue`).
   */
  injectRootOptions(file, options) {
    const _options = this.rootOptions[file] || (this.rootOptions[file] = new Set())
    ;(Array.isArray(options) ? options : [options]).forEach(opt => {
      _options.add(opt)
    })
  }
}

// http://blog.shaochuancs.com/about-error-capturestacktrace/
// 获取调用栈信息
function extractCallDir() {
  const obj = {}
  Error.captureStackTrace(obj)
  // 在 lib\generator\xx 等各个模块中 调用 generator.render()
  // 将会排在调用栈中的第四个，也就是 obj.stack.split('\n')[3]
  const callSite = obj.stack.split('\n')[3]

  // the regexp for the stack when called inside a named function
  const namedStackRegExp = /\s\((.*):\d+:\d+\)$/
  // the regexp for the stack when called inside an anonymous
  const anonymousStackRegExp = /at (.*):\d+:\d+$/

  let matchResult = callSite.match(namedStackRegExp)
  if (!matchResult) {
    matchResult = callSite.match(anonymousStackRegExp)
  }

  const fileName = matchResult[1]
  console.log('fileName::::: ', fileName)
  // 获取对应文件的目录
  return path.dirname(fileName)
}
