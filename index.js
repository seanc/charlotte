var Eris = require('eris');

var config = require('./config');
var bot = new Eris(config.token);
var minimist = require('minimist');
var util = require('./util');

bot.on('ready', function() {
  console.log('Successfully started');
});

bot.on('messageCreate', function(message) {
  var mentions = message.mentions;
  message.content = message.cleanContent = message.cleanContent
    .replace(/\B@[a-z0-9_-]+/gi, '')
    .trim();

  console.log(message.cleanContent);

  if (mentions.length > 0) {
    var mention = mentions[0];

    if (mention.discriminator === bot.user.discriminator) {
      var split = message.content.split(' ');
      var name = split[0];
      var opts = minimist(split.slice(1));
      util.callCommand(bot, name, message, opts);
    }
  }
});

bot.connect();
