const Command = require("@/client/command.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "pause",
			group: "music",
			description: "Pause the track",
			guildOnly: true
		});
	}

	run(message) {
		const dispatcher = message.guild.voice?.dispatcher;
		if (!dispatcher) return message.reply("I'm not playing anything!");

		dispatcher.pause();
		if (this.client.rpc.verbose) {
			this.client.rpc.pauseMusicStatus(message.guild.queue[message.guild.played - 1]);
		}
	}
};