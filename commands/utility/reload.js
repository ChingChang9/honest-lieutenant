const { Command } = require("discord.js-commando");

module.exports = class ReloadCommand extends Command {
	constructor(client) {
		super(client, {
			name: "reload",
			group: "utility",
			memberName: "reload",
			description: "Reload a command or command group",
			ownerOnly: true,
			hidden: true,
			args: [
				{
					key: "command",
					label: "command/group",
					prompt: "Which command or group would you like to reload?",
					type: "group|command"
				}
			]
		});
	}

	async run(message, { command }) {
		const isCmd = Boolean(command.groupID);
		command.reload();
    message.say(`Reloaded \`${ command.name }\` ${ isCmd ? "command" : "group" }`);
	}
};
