const Argument = require("@/client/argument.js");

module.exports = class Command {
	constructor(client, info) {
		this.client = client;
		this.name = info.name;
		this.group = info.group;
		this.aliases = info.aliases || [];
		this.description = info.description;
		this.format = info.format || null;
		this.examples = info.examples || null;
		this.default = info.default || null;
		this.nsfw = info.nsfw;
		this.guildOnly = info.guildOnly;
		this.voiceOnly = info.voiceOnly;
		this.ownerOnly = info.ownerOnly;
		this.guarded = info.guarded;
		this.hidden = info.hidden;
		this.clientPermissions = info.clientPermissions || null;
		this.userPermissions = info.userPermissions || null;
		this.throttling = info.throttling || null;
		this.arguments = info.arguments?.map(arg => new Argument(this.client, arg)) || [];
		this._throttles = new Map();
	}

	throttle(userID) {
		if(!this.throttling || this.client.isOwner(userID)) return null;

		let throttle = this._throttles.get(userID);
		if (!throttle) {
			throttle = {
				start: Date.now(),
				usages: 0,
				timeout: this.client.setTimeout(() => {
					this._throttles.delete(userID);
				}, this.throttling.duration * 1000)
			};
			this._throttles.set(userID, throttle);
		}

		return throttle;
	}

	setDisabledIn(guild, disabled) {
		guild.setCommandDisabled(this, disabled);
	}

	isDisabledIn(guild) {
		if (this.guarded) return false;
		return guild.isGroupDisabled(this.group) || guild.isCommandDisabled(this);
	}

	reload() {
		const path = `${ this.client.registry.commandsPath }/${ this.group.name }/${ this.name }.js`;
		delete require.cache[path];
		const command = require(path);

		this.client.registry.registerCommand(command);
	}
};