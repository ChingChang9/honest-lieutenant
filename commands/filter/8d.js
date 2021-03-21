const Command = require("@/client/command.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "8d",
			group: "filter",
			aliases: ["surround"],
			description: "Toggle 8D audio",
			voiceOnly: true
		});
	}

	async run(message) {
		await message.member.voice.channel.join().then(connection => connection.voice.setSelfDeaf(true));
		message.guild.voice.applyFilter(message, "8D");
	}
};