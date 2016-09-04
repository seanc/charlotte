var Eris = require('eris');

var bot = new Eris('MjIwMDEwNjY0MTYzNDA5OTQw.CqaEag.9UhPsI6WPOe2Ur2F89dXd-Pbjzk');
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
