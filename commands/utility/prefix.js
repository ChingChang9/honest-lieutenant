const { Command } = require("discord.js-commando");

module.exports = class PrefixCommand extends Command {
	constructor(client) {
		super(client, {
			name: "prefix",
			group: "utility",
			memberName: "prefix",
			description: "Shows or sets the command prefix",
			format: "[prefix/default]",
			examples: [
				"` (Shows my prefix in this server)",
				" -` (Sets my prefix in this server to `-`)",
				" default` (Resets my prefix in this server to default)"
			],
			guildOnly: true,
			guarded: true,
			args: [
				{
					key: "newPrefix",
					prompt: "What would you like to set the bot's prefix to?",
					type: "string",
					max: 15,
					default: ""
				}
			]
		});
	}

	async run(message, { newPrefix }) {
		if (!newPrefix) {
			const currentPrefix = message.guild?.commandPrefix || this.client.commandPrefix;
			return message.say(`My prefix in this server is \`${ currentPrefix }\``);
		}

		if (!message.member.hasPermission("ADMINISTRATOR")) {
			return message.reply("sorry, you need admin permission to change the prefix");
		}

		if (newPrefix.toLowerCase() === "default") {
			message.guild.commandPrefix = null;
			message.say(`Reset the command prefix to default: \`${ this.client.commandPrefix }\``);
		} else {
			message.guild.commandPrefix = newPrefix;
			message.say(`Set the command prefix to \`${ newPrefix }\``);
		}
	}
};