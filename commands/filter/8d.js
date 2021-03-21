const Command = require("@/client/command.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "8d",
			group: "filter",
			aliases: ["surround"],
			description: "Toggle 8D audio",
			guildOnly: true
		});
	}

	async run(message) {
		if (!message.member.voice.channel) {
			return message.reply("Please only use this when you're in a voice channel");
		}

		await message.member.voice.channel.join().then(connection => connection.voice.setSelfDeaf(true));
		message.guild.voice.applyFilter(message, "8D");
	}
};