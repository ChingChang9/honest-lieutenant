const Command = require("@/client/command.js");

module.exports = class WtfCommand extends Command {
	constructor(client) {
		super(client, {
			name: "wtf",
			group: "filter",
			description: "An audio filter for you psychopaths",
			guildOnly: true
		});
	}

	async run(message) {
		if (!message.member.voice.channel) {
			return message.reply("please only use this when you're in a voice channel")
		}

		await message.member.voice.channel.join().then(connection => connection.voice.setSelfDeaf(true));

		message.guild.voice?.clearAllFilters(message)
		message.guild.voice.applyFilter(message, "WTF");
	}
};