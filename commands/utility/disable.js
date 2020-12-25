const { Command } = require("discord.js-commando");

module.exports = class DisableCommand extends Command {
	constructor(client) {
		super(client, {
			name: "disable",
			group: "utility",
			memberName: "disable",
			description: "Disables a command or command group",
      userPermissions: ["ADMINISTRATOR"],
			guarded: true,
			args: [
				{
					key: "command",
					label: "command/group",
					prompt: "Which command or group would you like to disable?",
					type: "group|command"
				}
			]
		});
	}

	run(message, { command }) {
		if (command.guarded) {
			return message.reply(`The \`${ command.name }\` ${ command.group ? "command" : "group" } cannot be disabled`);
		}
		command.setEnabledIn(message.guild, false);
		if (command.group) {
			message.say(`Disabled all commands in \`${ command.group }\``);
		} else {
			message.say(`Disabled the \`${ command.name }\` command`);
		}
	}
};
