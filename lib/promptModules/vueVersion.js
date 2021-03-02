module.exports = promptAPIInstance => {
  promptAPIInstance.injectFrame({
    name: 'Use Vue frame',
    value: 'vueFrame',
  })

  promptAPIInstance.injectFeature({
    name: 'Choose Vue vision',
    value: 'Vue',
    checked: true
  })

  promptAPIInstance.injectPrompt({
    name: 'vueVersion',
    when: answers => answers.features.includes('Vue'),
    message: 'Choose a version of Vue.js that you want to start the project with',
    type: 'list',
    choices: [
      {
        name: '2.x',
        value: '2'
      },
      {
        name: '3.x (Preview)',
        value: '3'
      }
    ],
    default: '2'
  })
}
