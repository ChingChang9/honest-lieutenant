const Command = require("@/client/command.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "normalizer",
			group: "filter",
			aliases: ["normalize"],
			description: "Toggle audio normalizer",
			voiceOnly: true
		});
	}

	async run(message) {
		await message.member.voice.channel.join().then(connection => connection.voice.setSelfDeaf(true));
		message.guild.voice.applyFilter(message, "Normalizer");
	}
};