const Command = require("@/client/command.js");

module.exports = class PrefixCommand extends Command {
	constructor(client) {
		super(client, {
			name: "prefix",
			group: "utility",
			description: "Shows or sets the command prefix",
			format: "[prefix/default]",
			examples: [
				{
					input: "",
					explanation: "Shows my prefix in this server"
				},
				{
					input: "-",
					explanation: "Sets my prefix in this server to `-`"
				},
				{
					input: "default",
					explanation: "Resets my prefix in this server to default"
				}
			],
			guildOnly: true,
			guarded: true,
			arguments: [
				{
					key: "newPrefix",
					default: ""
				}
			]
		});
	}

	run(message, { newPrefix }) {
		if (!newPrefix && message.guild) {
			return message.say(`My prefix in this server is \`${ message.guild.commandPrefix }\``);
		} else if (!newPrefix) {
			return message.say(`My global prefix is \`${ this.client.commandPrefix }\``);
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