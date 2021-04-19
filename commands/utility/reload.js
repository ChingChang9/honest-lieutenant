const Command = require("@/client/command.js");
const CommandGroup = require("@/client/commandGroup.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "reload",
			group: "utility",
			description: "Reload a command or command group",
			format: "<command/group>",
			examples: [
				{
					input: "meme",
					explanation: "Reload all commands in `🙃 Meme`"
				},
				{
					input: "dog",
					explanation: "Reload the `dog` command"
				}
			],
			ownerOnly: true,
			hidden: true,
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
		command.reload();
		message.say(`Reloaded the \`${ command.name }\` ${ command.group ? "command" : "group" }`);
	}
};