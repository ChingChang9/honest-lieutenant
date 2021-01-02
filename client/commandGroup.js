const { Collection } = require("discord.js");

module.exports = class CommandGroup {
	constructor(client, info) {
		this.client = client;
		this.id = info.id;
		this.name = info.name;
		this.guarded = info.guarded || false;
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