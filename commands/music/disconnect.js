const { Command } = require("discord.js-commando");
const play = require("@/scripts/play.js");
const server = require("@/scripts/servers.js");

module.exports = class DisconnectCommand extends Command {
  constructor(client) {
    super(client, {
			name: "disconnect",
			group: "music",
			memberName: "disconnect",
			aliases: ["leave", "stop", "quit"],
			description: "Disconnect me from the voice channel",
      guildOnly: true
		});
  }

  async run(message) {
    message.guild.voice?.channel?.leave();
    message.react("👍🏽");
    server.setTimeout(message.guild.id, null);
    server.setDispatcher(message.guild.id, null);
  }
};