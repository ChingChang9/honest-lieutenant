const Command = require("@/client/command.js");
const servers = require("@/scripts/servers.js");

module.exports = class ResumeCommand extends Command {
	constructor(client) {
		super(client, {
			name: "resume",
			group: "music",
			aliases: ["continue"],
			description: "Resumes the music",
			guildOnly: true
		});
	}

	run(message) {
		const dispatcher = servers.getDispatcher(message.guild.id);
		if (!dispatcher) {
			return message.reply("I wasn't playing anything!");
		}
		dispatcher.resume();
	}
};