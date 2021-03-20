const { Collection } = require("discord.js");
const CommandGroup = require("@/client/commandGroup.js");

module.exports = class Registry {
	constructor(client) {
		this.client = client;
		this.commands = new Collection();
		this.groups = new Collection();
		this.commandsPath = null;
		this.root = null;
		this.registerGroups([
			{ name: "utility", displayName: "⚙️ Utility", guarded: true },
			{ name: "music", displayName: "🎵 Music" },
			{ name: "filter", displayName: "🎚️ Music Filter" },
			{ name: "reaction", displayName: "<:tsundere:763493801301245975> Reaction" },
			{ name: "weeb", displayName: "<:weeb:795670535471497238> Weeb" },
			{ name: "picture", displayName: "🖼️ Picture" },
			{ name: "reddit", displayName: "<:reddit:795548625761468416> Reddit" },
			{ name: "meme", displayName: "🙃 Meme Maker" },
			{ name: "other", displayName: "❓ Other" }
		]);
	}

	registerGroups(folders) {
		folders.forEach(folder => {
			const group = new CommandGroup(this.client, folder);
			this.groups.set(group.name, group);
		});
		return this;
	}

	registerCommandsIn(root, dir) {
		const obj = require("require-all")({
			dirname: `${ root }/${ dir }`,
			excludeDirs: "prefixless"
		});
		for (const folder of Object.values(obj)) {
			for (const file of Object.values(folder)) {
				this.registerCommand(file);
			}
		}

		this.commandsPath = `${ root }/${ dir }`;
		this.root = root;
		return this.client;
	}

	registerCommand(file) {
		const command = new file(this.client);
		const group = this.groups.find(group => group.name === command.group);

		command.group = group;
		group.commands.set(command.name, command);
		this.commands.set(command.name, command);
	}

	findGroup(search) {
		search = search.toLowerCase();
		return this.groups.find(group => group.name === search || group.displayName.toLowerCase() === search);
	}

	findGroups(search) {
		search = search.toLowerCase();

		let matchedGroups = [];

		for (const group of this.groups.values()) {
			if (group.displayName.toLowerCase() === search || group.name === search) return [group];

			if (group.name.includes(search) || group.displayName.toLowerCase().includes(search)) {
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