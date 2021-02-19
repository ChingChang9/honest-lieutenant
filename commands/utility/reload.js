const Command = require("@/client/command.js");
const CommandGroup = require("@/client/commandGroup.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "reload",
			group: "utility",
			description: "Reloads a command or command group",
			format: "<command/group>",
			examples: [
				{
					input: "meme",
					explanation: "Reloads all commands in `🙃 Meme`"
				},
				{
					input: "dog",
					explanation: "Reloads the `dog` command"
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
						"cannot find the command/group"
				}
			]
		});
	}

	run(message, { command }) {
		command.reload();
		message.say(`Reloaded the \`${ command.name }\` ${ command.group ? "command" : "group" }`);
	}
};