exports.getPromptModules = () => {
  return [
    'vueVersion',
    'svelte',
    'router',
    'vuex'
  ].map(file => require(`../promptModules/${file}`))
}
