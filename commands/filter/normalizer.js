const Command = require("@/client/command.js");

module.exports = class NormalizerDCommand extends Command {
	constructor(client) {
		super(client, {
			name: "normalizer",
			group: "filter",
			aliases: ["normalize"],
			description: "Toggles audio normalizer",
			guildOnly: true
		});
	}

	async run(message) {
		if (!message.member.voice.channel) {
			return message.reply("please only use this when you're in a voice channel");
		}

		await message.member.voice.channel.join().then(connection => connection.voice.setSelfDeaf(true));
		message.guild.voice.applyFilter(message, "Normalizer");
	}
};