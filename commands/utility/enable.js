const { Command } = require("discord.js-commando");

module.exports = class EnableCommand extends Command {
	constructor(client) {
		super(client, {
			name: "enable",
			group: "utility",
			memberName: "enable",
			description: "Enables a command or command group",
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
		command.setEnabledIn(message.guild, true);
    const group = command.group;
    let messageString = "";
    if (group) {
      message.say(`Enabled the \`${ command.name }\` command${
        group.isEnabledIn(message.guild) ? "" : `, but the \`${ group.name }\` group is disabled, so it still can't be used`
      }`);
		} else {
      message.say(`Enabled all commands in \`${ command.name }\``);
		}
	}
};
