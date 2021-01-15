const { Collection } = require("discord.js");
const CommandGroup = require("@/client/commandGroup.js");

module.exports = class Registry {
	constructor(client) {
		this.client = client;
		this.commands = new Collection();
		this.groups = new Collection();
		this.commandsPath = null;
		this.registerGroups([
			{ id: "utility", name: "⚙️ Utility", guarded: true },
			{ id: "music", name: "🎵 Music" },
			{ id: "filter", name: "🎚️ Music Filter" },
			{ id: "reaction", name: "<:tsundere:763493801301245975> Reaction" },
			{ id: "weeb", name: "<:weeb:795670535471497238> Weeb" },
			{ id: "picture", name: "🖼️ Picture" },
			{ id: "reddit", name: "<:reddit:795548625761468416> Reddit" },
			{ id: "meme", name: "🙃 Meme Maker" },
			{ id: "other", name: "❓ Other" }
		]);
	}

	registerGroups(folders) {
		folders.forEach(folder => {
			const group = new CommandGroup(this.client, folder);
			this.groups.set(group.id, group);
		});
		return this;
	}

	registerCommandsIn(path) {
		const obj = require("require-all")({
			dirname: path,
			excludeDirs: "prefixless"
		});
		for (const folder of Object.values(obj)) {
			for (const file of Object.values(folder)) {
				this.registerCommand(file);
			}
		}

		this.commandsPath = path;
		return this.client;
	}

	registerCommand(file) {
		const command = new file(this.client);
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