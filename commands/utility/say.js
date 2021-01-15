const Command = require("@/client/command.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "say",
			group: "utility",
			description: "Says something in a channel",
			format: "[channel] <text>",
			default: "this channel",
			examples: [
				{
					input: "#general hi everyone!",
					explanation: "Says \"hi everyone!\" in #general"
				},
				{
					input: "I am a bot",
					explanation: "Replaces this message with \"I am a bot\""
				}
			],
			guildOnly: true,
			ownerOnly: true,
			hidden: true,
			arguments: [
				{
					key: "argString"
				}
			]
		});
	}

	run(message, { argString }) {
		const match = argString.match(/^(<#)([0-9]+)>/);
		if (match) {
			message.guild.channels.cache.get(match[2]).send(argString.slice(22)).catch(error => {
				if (error.message === "Missing Access") {
					message.reply("I don't have permission to post in that channel :(");
				} else {
					message.error(error);
				}
			});
		} else {
			message.delete();
			message.say(argString);
		}
	}
};