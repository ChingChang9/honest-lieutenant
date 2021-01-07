const Command = require("@/client/command.js");

module.exports = class VaporwaveCommand extends Command {
	constructor(client) {
		super(client, {
			name: "vibrate",
			group: "filter",
			aliases: ["vibrato"],
			description: "Toggles the vibration filter",
			guildOnly: true
		});
	}

	async run(message) {
		if (!message.member.voice.channel) {
			return message.reply("please only use this when you're in a voice channel");
		}

		await message.member.voice.channel.join().then(connection => connection.voice.setSelfDeaf(true));
		message.guild.voice.applyFilter(message, "Vibrate");
	}
};