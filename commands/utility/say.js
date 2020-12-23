const { Command } = require("discord.js-commando");

module.exports = class SayCommand extends Command {
  constructor(client) {
    super(client, {
      name: "say",
			group: "utility",
			memberName: "say",
			description: "Say something in a channel",
      format: "[channel-id] <text>",
      guildOnly: true,
      ownerOnly: true,
      hidden: true
    });
  }

  run(message, args) {
    if (args.match(/^<#/)) {
      message.guild.channels.cache.get(args.slice(2, 20)).send(args.slice(22)).catch((error) => {
        message.reply("I don't have permission to post in that channel :(");
      });
    } else {
      message.delete();
      message.say(args);
    }
  }
};