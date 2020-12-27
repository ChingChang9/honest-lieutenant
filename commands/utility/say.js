const { Command } = require("discord.js-commando");

module.exports = class SayCommand extends Command {
  constructor(client) {
    super(client, {
      name: "say",
			group: "utility",
			memberName: "say",
			description: "Says something in a channel",
      format: "[channel] <text>",
      examples: [
        " #general hi everyone!` (Says \"hi everyone\" in #general)",
        " I am a bot` (Replaces this message with \"I am a bot\")"
      ],
      guildOnly: true,
      ownerOnly: true,
      hidden: true
    });
    this.default = "this channel"
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