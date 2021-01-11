const Command = require("@/client/command.js");

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
		const dispatcher = message.guild.voice?.dispatcher;
		if (!dispatcher) {
			message.reply("I wasn't playing anything!");
		} else {
			dispatcher.resume();
			process.emit("MUSICRESUME", message.guild);
		}
	}
};