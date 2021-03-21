const Command = require("@/client/command.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "vibrate",
			group: "filter",
			aliases: ["vibrato"],
			description: "Toggle the vibration filter",
			voiceOnly: true
		});
	}

	async run(message) {
		await message.member.voice.channel.join().then(connection => connection.voice.setSelfDeaf(true));
		message.guild.voice.applyFilter(message, "Vibrate");
	}
};