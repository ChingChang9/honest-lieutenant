const { Command } = require("discord.js-commando");

module.exports = class ReloadCommand extends Command {
	constructor(client) {
		super(client, {
			name: "reload",
			group: "utility",
			memberName: "reload",
			description: "Reloads a command or command group",
			format: "<command/group>",
			examples: [
				" meme` (Reloads all commands in `🙃 Meme`)",
				" dog` (Reloads the `dog` command)"
			],
			ownerOnly: true,
			hidden: true,
			args: [
				{
					key: "command",
					prompt: "Which command/group would you like to reload?",
					type: "command|group"
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