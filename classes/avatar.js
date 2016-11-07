const Command = require('../lib/command')
const request = require('request')
const dedent = require('dedent')

class AvatarCommand extends Command {

  constructor (bot, config) {
    super(bot, config)

    this.name = 'avatar'
    this.usage = 'avatar [username#discriminator | id]'
    this.description = 'Get the avatar of a user or yourself'
  }

  handle (message, args, flags) {
    if (!args.length) return this.upload(message.author, message)

    const input = args.join('').trim()
    if (input.includes('#')) {
      const discriminator = input.split('#').pop()
      const user = message.guild.members.filter(m => {
        return m.user.discriminator === discriminator
      }).first()
      if (user) return this.upload(user.user, message)
    }

    if (input.trim()) {
      const username = input.toLowerCase()
      const user = message.guild.members.filter(m => {
        return m.user.username.toLowerCase() === username ||
        (m.nickname ? m.nickname.toLowerCase() : '') === username
      })
      if (user.size > 1) {
        return message.reply(dedent`
          There are multiple users matching the username ${username},
          please select a specific one by specificing a discriminator

          ${user.array().map((m) => {
          return `${m.user.username}#${m.user.discriminator}`
          }).join(', ')}
        `, { split: true })
      }

      const member = user.first()
      if (member) return this.upload(member.user, message)
    }

    if (!isNaN(input)) {
      const user = message.guild.members.find('id', input)
      if (user) return this.upload(user.user, message)
    }
  }

  upload (user, message) {
    request.get(user.avatarURL, { encoding: null }, (err, res, body) => {
      if (err) {
        this.bot.emit('error', err)
        return this.message(message.reply('An error occurred')).deleteAfter(5000)
      }

      message.channel.sendFile(body, `${message.author.username}.png`).catch(e => {
        this.bot.emit('error', err)
        return this.message(message.reply('An error occurred')).deleteAfter(5000)
      })
    })
  }

}

module.exports = AvatarCommand
