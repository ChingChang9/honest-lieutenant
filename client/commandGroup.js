const { Collection } = require("discord.js");

module.exports = class CommandGroup {
	constructor(client, folder) {
		this.client = client;
		this.name = folder.name;
		this.displayName = folder.displayName;
		this.guarded = folder.guarded || false;
		this.commands = new Collection();
	}

	setEnabledIn(guild, enabled) {
		guild.setGroupEnabled(this, enabled);
	}

	isEnabledIn(guild) {
		guild = this.client.guilds.resolve(guild);
		return guild.isGroupEnabled(this);
	}

	reload() {
		this.commands.forEach(command => command.reload());
	}
};