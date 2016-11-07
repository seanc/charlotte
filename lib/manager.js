const Manager = require('discord.js').ShardingManager
const config = require('rc')('charlotte', {})
const manager = new Manager('./lib/start.js', {
  totalShards: 'auto',
  token: config.token
})
const zt = require('zt')

manager.on('launch', shard => {
  zt.log(`Shard ${shard.id} started`)
})

module.exports = manager;
