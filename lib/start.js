const minimist = require('minimist')
const log = require('log-cb')
const glob = require('require-glob')
const spawnargs = require('spawn-args')
const config = require('rc')('charlotte', {
  token: '',
  prefix: '!',
  admin: []
})
const Bot = require('discord.js').Client
const bot = new Bot()

function start(bot, config) {
  const commands = new Map()

  glob(['../classes/**/*.js']).then(modules => {
    for (let module in modules) {
      module = (new modules[module](bot, config))
      const parent = Object.getPrototypeOf(module.constructor).name
      if (parent === 'Command') commands.set(module.getName(), module)
    }
  })

  bot.on('message', message => {
    if (!message.content.startsWith(config.prefix)) return
    const prefix = config.prefix
    const input = spawnargs(message.content.slice(prefix.length))
    const parse = minimist(input)
    const name = parse._.shift()
    const args = parse._
    delete parse._
    const flags = parse

    if (commands.has(name)) commands.get(name).handle(message, args, flags)
  })

  bot.on('error', log.err())
  bot.login(config.token)
}

start(bot, config)
