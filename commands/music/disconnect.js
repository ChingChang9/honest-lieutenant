const Command = require("@/client/command.js");

module.exports = class DisconnectCommand extends Command {
	constructor(client) {
		super(client, {
			name: "disconnect",
			group: "music",
			aliases: ["disc", "dc", "leave", "stop", "quit"],
			description: "Disconnects me from the voice channel",
			guildOnly: true
		});
	}

	run(message) {
		message.guild.timeout = null;
		message.guild.voice?.channel?.leave();
		if (message.guild.voice?.dispatcher) {
			message.guild.voice.dispatcher = null;
		}
		message.react("👍🏽");
	}
};