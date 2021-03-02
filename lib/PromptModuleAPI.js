module.exports = class PromptModuleAPI {
  constructor (promptInfo) {
    this.promptInfo = promptInfo
  }

  injectFrame(frame) {
    this.promptInfo.framePrompt.choices.push(frame)
  }

  injectFeature (feature) {
    this.promptInfo.featurePrompt.choices.push(feature)
  }

  injectPrompt (prompt) {
    this.promptInfo.injectedPrompts.push(prompt)
  }

  injectOptionForPrompt (name, option) {
    this.promptInfo.injectedPrompts.find(f => {
      return f.name === name
    }).choices.push(option)
  }
}
