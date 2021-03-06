const Command = require("@/client/command.js");

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			name: "help",
			group: "utility",
			aliases: ["h", "alias", "aliases", "command", "commands"],
			description: "List all of my commands or details about a specific command",
			format: "[command]",
			examples: [
				{
					explanation: "List all my commands"
				},
				{
					input: "prefix",
					explanation: "Show a detailed menu for the `prefix` command"
				}
			],
			guarded: true,
			arguments: [
				{
					key: "command",
					default: ""
				}
			]
		});
	}

	run(message, { command }) {
		const prefix = message.guild?.commandPrefix || this.client.commandPrefix;
		if (!command) {
			const fields = getCommands(this.client, prefix);
			return message.embed({
				files: ["./assets/icon.jpg"],
				author: {
					name: "Honest Lieutenant's Commands",
					icon_url: "attachment://icon.jpg",
					url: "https://www.chingchang.dev"
				},
				description: `Use \`${ prefix }help [command]\` for more information on a specific command\n\`<>\`: Required \`[]\`: Optional`,
				fields,
				footer: {
					text: "Ching Chang © 2021 Some Rights Reserved",
					icon_url: "attachment://icon.jpg"
				}
			});
		}

		const commands = this.client.registry.findCommands(command);

		if (!commands.length) return message.reply(`I can't find the command. Use \`${ prefix }help\` to see all my commands`);
		if (commands.length > 1) return message.reply("Please be more specific");{

			command = commands[0];
			const fields = getDetails(command, prefix);
			message.embed({
				title: `${ prefix }${ command.name }`,
				description: command.description,
				fields
			});
		}
	}
};

function getCommands(client, prefix) {
	const displayPrefix = prefix.length === 1 ? prefix : "";
	let fields = [];
	client.registry.groups.forEach(group => {
		fields.push({
			name: group.displayName,
			value: `\`${ displayPrefix }${ group.commands.map(command => {
				if (!command.hidden) return command.name;
			}).filter(Boolean).join(`\`, \`${ displayPrefix }`) }\``
		});
	});
	return fields;
}

function getDetails(command, prefix) {
	let fields = [];
	fields.push({
		name: "Usage",
		value: `\`${ prefix }${ command.name }${ command.format ? ` ${ command.format }` : "" }\``,
		inline: true
	});
	fields.push({
		name: "Default Value",
		value: command.arguments[0]?.default || command.default || "No default value",
		inline: true
	});
	if (command.examples) {
		fields.push({
			name: "Examples",
			value: command.examples.map(example => `\`${ prefix }${ command.name }${
				example.input ? ` ${ example.input }` : "" }\`${
				example.explanation ? ` (${ example.explanation })` : "" }`).join("\n")
		});
	}
	fields.push({
		name: "Aliases",
		value: command.aliases.length ? `\`${ prefix }${ command.aliases.join(`\`, \`${ prefix }`) }\`` : "No aliases"
	});

	return fields;
}