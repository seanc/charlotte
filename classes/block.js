const Command = require('../lib/command')

class BlockCommand extends Command {

  constructor (bot, config) {
    super(bot, config)

    this.name = 'block'
    this.usage = 'block <message>'
    this.description = 'Convert a message into indicator emotes'
  }

  handle (message, args, flags) {
    if (!args.length) return this.message(message.reply('Invalid arguments provided')).deleteAfter(2000)
    message.channel.sendMessage(args.join(' ').split('').map(l => {
      if (l.trim() && /[a-z]/i.test(l)) return `:regional_indicator_${l}:`
      else return '\t'
    }).join(''))
  }

}

module.exports = BlockCommand
