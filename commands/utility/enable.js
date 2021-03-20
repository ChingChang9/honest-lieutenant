const Command = require("@/client/command.js");
const CommandGroup = require("@/client/commandGroup.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "enable",
			group: "utility",
			description: "Enable a command or command group",
			format: "<command/group>",
			examples: [
				{
					input: "meme",
					explanation: "Enables all commands in `🙃 Meme`"
				},
				{
					input: "dog",
					explanation: "Enables the `dog` command"
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
						"cannot find the command/group"
				}
			]
		});
	}

	run(message, { command }) {
		command.setEnabledIn(message.guild, true);
		const group = command.group;
		if (group) {
			message.say(`Enabled the \`${ command.name }\` command${
				group.isEnabledIn(message.guild) === false ? `, but the \`${ group.displayName }\` group is disabled, so it still can't be used` : ""
			}`);
		} else {
			message.say(`Enabled all commands in \`${ command.name }\``);
		}
	}
};