/*
 * @Description:
 * @Author: xiehuaqiang
 * @FilePath: /kaka-cli/lib/generator/router/index.js
 * @Date: 2021-03-02 17:58:17
 */

/**
 * require(`./generator/${newFeature}`)(generator, answers)
 */
module.exports = (generator, answers = {}) => {
  generator.injectImports(generator.entryFile, `import router from './router'`)

  generator.injectRootOptions(generator.entryFile, `router`)

  generator.extendPackage({
    dependencies: {
      'vue-router': '^3.5.1'
    }
  })

  generator.render('./template', {
    historyMode: answers.historyMode,
    hasTypeScript: false,
    plugins: []
  })
}
