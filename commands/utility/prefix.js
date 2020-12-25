const { Command } = require("discord.js-commando");

module.exports = class PrefixCommand extends Command {
	constructor(client) {
		super(client, {
			name: "prefix",
			group: "utility",
			memberName: "prefix",
			description: 'Shows or sets the command prefix.',
			format: "[prefix/default]",
			guildOnly: true,
			examples: ["prefix", "prefix -", "prefix default"],
			args: [
				{
					key: "prefix",
					prompt: "What would you like to set the bot's prefix to?",
					type: "string",
					max: 15,
					default: ""
				}
			]
		});
	}

	async run(message, args) {
		if (!args.prefix) {
			const prefix = message.guild?.commandPrefix || this.client.commandPrefix;
			return message.say(`My prefix in this server is \`${ prefix }\``);
		}

		if (!message.member.hasPermission('ADMINISTRATOR')) {
			return message.reply("sorry, you need admin permission to change the prefix");
		}

		if (args.prefix.toLowerCase() === "default") {
			message.guild.commandPrefix = null;
			message.say(`Reset the command prefix to default: \`${ this.client.commandPrefix }\``);
		} else {
			message.guild.commandPrefix = args.prefix;
			message.say(`Set the command prefix to \`${ args.prefix }\``);
		}
	}
};
