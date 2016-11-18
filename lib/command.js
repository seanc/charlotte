class Command {

  constructor (bot, config) {
    this.bot = bot
    this.config = config
  }

  getName () {
    return this.name
  }

  getAliases () {
    return this.aliases || []
  }

  getUsage () {
    return this.usage || ''
  }

  getDescription () {
    return this.description || ''
  }

  getAdmin () {
    return this.admin || false
  }

  message (_message) {
    _message.deleteAfter = (n) => setTimeout(() => _message.then(m => m.delete()), n)
    return _message
  }

  handle (message, args, flags) {
    console.log(`command ${this.getName()} does not have a handler`)
  }

}

module.exports = Command
