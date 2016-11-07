const Command = require('../lib/command')
const parse = require('markdown').markdown.parse
const vm = require('vm')
const util = require('util')

class EvalCommand extends Command {

  constructor (bot, config) {
    super(bot, config)

    this.name = 'eval'
    this.usage = 'eval <code>'
    this.description = 'Execute javascript and receive the output'
  }

  handle (message, args, flags) {
    if (!this.config.admin.includes(message.author.id)) return
    if (!args.length) return this.message(message.reply('Invalid arguments provided')).deleteAfter(2000)
    try {
      const block = args.join(' ').trim()
      const code = parse(block)[1][1][1].replace(/^js(.*)/g, '')

      const script = new vm.Script(unescape(code), {
        timeout: 10000
      });
      const inject = {
        message: message,
        args: args,
        bot: this.bot,
        flags: flags,
        require: require,
        debug: function(_message) {
          message.channel.sendCode('js', util.inspect(_message), {split: true})
        }
      };
      Object.assign(inject, global)

      const context = vm.createContext(inject);
      const result = script.runInContext(context, {
        timeout: 5000
      })

      message.channel.sendMessage(`${'Input:\n' + '```js\n' + unescape(code) + '```' + '\nOutput:\n' + '```js\n' + util.inspect(result) + '```'}`)
      message.delete()
    } catch (e) {
      message.channel.sendCode('js', e)
    }
  }

}

module.exports = EvalCommand
