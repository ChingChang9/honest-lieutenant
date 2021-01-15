const Command = require("@/client/command.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "pause",
			group: "music",
			description: "Pauses the music in the voice channel",
			guildOnly: true
		});
	}

	run(message) {
		const dispatcher = message.guild.voice?.dispatcher;
		if (!dispatcher) {
			message.reply("I'm not playing anything!");
		} else {
			dispatcher.pause();
			process.emit("MUSICPAUSE", message.guild);
		}
	}
};