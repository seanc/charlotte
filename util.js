var Promise = require('bluebird');
var ini = require('ini');
var remove = require('remove-markdown');
var vm = require('vm');

exports.getGuild = function getGuild(bot, guildID) {
  return bot.guilds.find(function(guild) {
    return guild.id === guild;
  });
};

exports.getConfig = function getConfig(bot) {
  var hq = bot.guilds.find(function(guild) {
    return guild.id === '221902538679648256';
  });

  var config = hq.channels.find(function(channel) {
    return channel.name === 'config';
  });

  return new Promise(function(resolve, reject) {
    bot.getMessage(config.id, config.lastMessageID)
    .then(function(msg) {
      resolve(ini.parse(remove(msg.content)));
    })
    .catch(function(err) {
      reject(err);
    });
  });
};

exports.callCommand = function callCommand(bot, name, message, opts) {
  var hq = bot.guilds.find(function(guild) {
    return guild.id === '221902538679648256';
  });

  var command = hq.channels.find(function(channel) {
    return channel.name === 'command-' + name;
  });

  if (command) {
    bot.getMessage(command.id, command.lastMessageID)
    .then(function(msg) {
      var code = remove(msg.content).replace('`', '');
      var sandbox = {
        bot: bot,
        message: message,
        opts: opts,
        utils: exports,
        remove: remove
      };
      var script = new vm.Script(code);
      var context = new vm.createContext(sandbox);
      script.runInContext(context);
    })
  }
};

exports.isOwner = function isOwner(bot, message) {
  return new Promise(function(resolve, reject) {
    exports.getConfig(bot)
    .then(function(config) {
      resolve(message.author.id === config.owner);
    })
    .catch(reject);
  });
};
