const Command = require("@/client/command.js");

module.exports = class PauseCommand extends Command {
	constructor(client) {
		super(client, {
			name: "pause",
			group: "music",
			description: "Pauses the music in the voice channel",
			guildOnly: true
		});
	}

	run(message) {
		const dispatcher = message.guild.dispatcher;
		if (!dispatcher) {
			return message.reply("I'm not playing anything!");
		}
		dispatcher.pause();
	}
};