const Command = require("@/client/command.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "resume",
			group: "music",
			aliases: ["continue"],
			description: "Resume the track",
			guildOnly: true
		});
	}

	run(message) {
		const dispatcher = message.guild.voice?.dispatcher;
		if (!dispatcher) return message.reply("I wasn't playing anything!");

		dispatcher.resume();
		if (this.client.rpc.verbose) {
			this.client.rpc.startMusicStatus(message.guild.queue[message.guild.played - 1], message.guild.voice.songElapsed);
		}
	}
};