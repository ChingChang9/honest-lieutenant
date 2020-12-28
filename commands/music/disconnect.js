const { Command } = require("discord.js-commando");
const play = require("@/scripts/play.js");
const server = require("@/scripts/servers.js");

module.exports = class DisconnectCommand extends Command {
  constructor(client) {
    super(client, {
			name: "disconnect",
			group: "music",
			memberName: "disconnect",
			aliases: ["disc", "dc", "leave", "stop", "quit"],
			description: "Disconnects me from the voice channel",
      guildOnly: true
		});
  }

  run(message) {
    server.setDispatcher(message.guild.id, null);
    server.setTimeout(message.guild.id, null);
    message.guild.voice?.channel?.leave();
    message.react("👍🏽");
  }
};