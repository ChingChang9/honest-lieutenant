const Command = require("@/client/command.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "karaoke",
			group: "filter",
			aliases: ["instrumental"],
			description: "Toggle karaoke mode (Remove vocals from the song)",
			voiceOnly: true
		});
	}

	async run(message) {
		await message.member.voice.channel.join().then(connection => connection.voice.setSelfDeaf(true));
		message.guild.voice.applyFilter(message, "Karaoke");
	}
};