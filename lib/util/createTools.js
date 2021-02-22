exports.getPromptModules = () => {
  return [
    'vueVersion',
    'babel'
  ].map(file => require(`../promptModules/${file}`))
}
