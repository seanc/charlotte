var Promise = require('bluebird');
var ini = require('ini');
var remove = require('remove-markdown');
var vm = require('vm');
var NodeCache = require('node-cache');
var cache = new NodeCache();

exports.getGuild = function getGuild(bot, guildID) {
  return bot.guilds.find(function(guild) {
    return guild.id === guild;
  });
};

exports.getConfig = function getConfig(bot) {
  console.log(config);
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
        args: opts._.slice(1),
        utils: exports,
        remove: remove,
        _: require('lodash'),
        crypto: require('crypto'),
        events: require('events'),
        querystring: require('querystring'),
        url: require('url'),
        Buffer: Buffer,
        util: require('util'),
        assert: require('assert'),
        zlib: require('zlib'),
        Promise: require('bluebird'),
        JSON: JSON,
        punycode: require('punycode'),
        path: require('path'),
        stream: require('stream'),
        timers: require('timers'),
        pixie: require('pixie'),
        kewler: require('kewler'),
        cheerio: require('cheerio'),
        through2: require('through2'),
        diagnose: require('diagnose'),
        osia: require('osia'),
        sate: require('sate'),
        microtime: require('microtime'),
        semver: require('semver'),
        request: require('request'),
        npmi: require('npmi'),
        require: require,
        cache: cache,
        debug: function(msg, pretty) {
          if (pretty) {
            msg = '```' + msg + '```';
          }
          var debug = hq.channels.find(function(channel) {
            return channel.name === 'debug';
          });
          bot.createMessage(debug.id, require('util').format(msg));
        },
        reply: function(msg, pretty) {
          if (pretty) {
            msg = '```' + msg + '```';
          }
          bot.createMessage(message.channel.id, require('util').format(msg));
        }
      };
      var script = new vm.Script(code);
      var context = new vm.createContext(sandbox);
      script.runInContext(context);
    });
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
