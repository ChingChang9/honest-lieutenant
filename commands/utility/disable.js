const Command = require("@/client/command.js");
const CommandGroup = require("@/client/commandGroup.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "disable",
			group: "utility",
			description: "Disable a command or command group",
			format: "<command/group>",
			examples: [
				{
					input: "meme",
					explanation: "Disable all commands in `🙃 Meme`"
				},
				{
					input: "dog",
					explanation: "Disable the `dog` command"
				}
			],
			userPermissions: ["ADMINISTRATOR"],
			guildOnly: true,
			guarded: true,
			arguments: [
				{
					key: "command",
					parse: command => this.client.registry.findCommands(command)[0] ||
						this.client.registry.findGroups(command)[0],
					validate: command => command instanceof Command || command instanceof CommandGroup ||
						"Cannot find the command/group"
				}
			]
		});
	}

	run(message, { command }) {
		if (command.guarded) {
			return message.reply(`The \`${ command.name }\` ${ command.group ? "command" : "group" } cannot be disabled`);
		}
		command.setDisabledIn(message.guild, true);
		if (command instanceof Command) {
			message.say(`Disabled the \`${ command.name }\` command`);
		} else {
			message.say(`Disabled all commands in \`${ command.name }\``);
		}
	}
};