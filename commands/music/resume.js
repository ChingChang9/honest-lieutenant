const { Command } = require("discord.js-commando");
const servers = require("@/scripts/servers.js");

module.exports = class ResumeCommand extends Command {
  constructor(client) {
    super(client, {
			name: "resume",
			group: "music",
			memberName: "resume",
			aliases: ["continue"],
			description: "Resume the music",
      guildOnly: true
		});
  }

  async run(message) {
    const dispatcher = await servers.getDispatcher(message.guild.id);
    if (!dispatcher) {
      return message.reply("I wasn't playing anything!");
    }
    dispatcher.resume();
  }
};