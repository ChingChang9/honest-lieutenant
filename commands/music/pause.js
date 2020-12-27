const { Command } = require("discord.js-commando");
const servers = require("@/scripts/servers.js");

module.exports = class PauseCommand extends Command {
  constructor(client) {
    super(client, {
			name: "pause",
			group: "music",
			memberName: "pause",
			description: "Pauses the music in the voice channel",
      guildOnly: true
		});
  }

  async run(message) {
    const dispatcher = await servers.getDispatcher(message.guild.id)
    if (!dispatcher) {
      return message.reply("I'm not playing anything!");
    }
    dispatcher.pause();
  }
};