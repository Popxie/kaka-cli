module.exports = generator => {
  generator.render('./template')
  generator.extendPackage({
    dependencies: {
      svelte: '^3.21.0',
      lodash: "^4.17.15",
      'tua-body-scroll-lock': '^1.0.0'
    },
    devDependencies: {
      "cross-env": "^5.2.1",
      "svelte-loader": "^2.13.6",
      "svelte-preprocess": "^3.4.0",
    }
  })

  generator.extendPackage({
    browserslist: ['> 1%', 'last 2 versions', 'not dead']
  })
}
