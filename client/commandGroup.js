const { Collection } = require("discord.js");

module.exports = class CommandGroup {
	constructor(client, folder) {
		this.client = client;
		this.name = folder.name;
		this.displayName = folder.displayName;
		this.guarded = folder.guarded || false;
		this.commands = new Collection();
	}

	setDisabledIn(guild, disabled) {
		guild.setGroupDisabled(this, disabled);
	}

	isDisabledIn(guild) {
		guild = this.client.guilds.resolve(guild);
		return guild.isGroupDisabled(this);
	}

	reload() {
		this.commands.forEach(command => command.reload());
	}
};