const Listener = require('../lib/listener')

class MessageListener extends Listener {

  constructor(bot, config) {
    super(bot, config)
    this.registerChatListener()
  }

  registerChatListener() {
    this.bot.on('message', message => {
      const guild = message.guild.name
      const username = message.author.username
      const discriminator = message.author.discriminator
      const content = message.cleanContent

      console.log(`[${guild}] ${username}#${discriminator}: ${content}`)
    })
  }

}

module.exports = MessageListener
