const { Collection } = require("discord.js");
const CommandGroup = require("@/client/commandGroup.js");

module.exports = class Registry {
	constructor(client) {
		this.client = client;
		this.commands = new Collection();
		this.groups = new Collection();
		this.commandsPath = null;
	}

	registerGroups(infos) {
		infos.forEach(info => {
			const group = new CommandGroup(this.client, info);
			this.groups.set(group.id, group);
		});
		return this;
	}

	registerCommandsIn(options) {
		const obj = require("require-all")(options);
		for (const group of Object.values(obj)) {
			for (const command of Object.values(group)) {
				this.registerCommand(command);
			}
		}

		this.commandsPath = options;
		return this.client;
	}

	registerCommand(command) {
		command = new command(this.client);
		const group = this.groups.find(group => group.id === command.group);

		command.group = group;
		group.commands.set(command.name, command);
		this.commands.set(command.name, command);
	}

	findGroup(search) {
		search = search.toLowerCase();
		return this.groups.find(group => group.id === search || group.name.toLowerCase() === search);
	}

	findGroups(search) {
		search = search.toLowerCase();

		let matchedGroups = [];

		for (const group of this.groups.values()) {
			if (group.name.toLowerCase() === search || group.id === search) return [group];

			if (group.id.includes(search) || group.name.toLowerCase().includes(search)) {
				matchedGroups.push(group);
			}
		}

		return matchedGroups;
	}

	findCommand(search) {
		search = search.toLowerCase();
		return this.commands.find(command => command.name === search || command.aliases.some(aliase => aliase === search));
	}

	findCommands(search) {
		search = search.toLowerCase();

		let matchedCommands = [];

		for (const command of this.commands.values()) {
			if (command.name === search || command.aliases.some(aliase => aliase === search)) return [command];

			if (command.name.includes(search) || command.aliases.some(aliase => aliase.includes(search))) {
				matchedCommands.push(command);
			}
		}

		return matchedCommands;
	}
};