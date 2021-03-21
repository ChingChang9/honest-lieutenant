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
		this.ownerOnly = info.ownerOnly;
		this.guarded = info.guarded;
		this.hidden = info.hidden;
		this.clientPermissions = info.clientPermissions || null;
		this.userPermissions = info.userPermissions || null;
		this.throttling = info.throttling || null;
		this.arguments = info.arguments?.map(arg => new Argument(this.client, arg)) || [];
		this._throttles = new Map();
	}

	hasPermission(message) {
		if (!this.ownerOnly && !this.userPermissions) return true;
		if (this.client.isOwner(message.author)) return true;

		if (this.ownerOnly) {
			return "this command can only be used by the bot owner";
		}

		if (this.userPermissions) {
			const missing = message.channel.permissionsFor(message.author).missing(this.userPermissions);
			if (missing.length === 1) {
				return `you need the \`${ missing[0].replace(/_/g, " ").toLowerCase() }\` permission`;
			} else if (missing.length > 0) {
				return `you need the following permissions: \`${ missing.map(perm => perm.toLowerCase().replace(/_/g, " ")).join("`, `") }\``;
			}
		}

		return true;
	}

	onBlock(message, reason, data) {
		switch(reason) {
			case "guildOnly":
				return message.reply(`The \`${ this.name }\` command can only be used in servers`);
			case "nsfw":
				return message.reply(`The \`${ this.name }\` command can only be used in NSFW channels`);
			case "permission": {
				if (data.response) return message.reply(data.response);
				return message.reply(`You do not have permission to use the \`${ this.name }\` command`);
			}
			case "clientPermissions": {
				if (data.missing.length === 1) {
					return message.reply(
						`I need the "${ data.missing[0].toLowerCase().replace(/_/g, " ") }" permission for the \`${ this.name }\` command to work`
					);
				}
				return message.reply(`I need the following permissions to run the \`${ this.name }\` command: ${
					data.missing.map(perm => perm.toLowerCase().replace(/_/g, " ")).join(", ") }`);
			}
			case "throttling": {
				return message.reply(`You may not use the \`${ this.name }\` command again for another ${ data.remaining.toFixed(1) } seconds`);
			}
		}
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

	setEnabledIn(guild, enabled) {
		guild.setCommandEnabled(this, enabled);
	}

	isEnabledIn(guild) {
		if (this.guarded) return true;
		return guild.isGroupEnabled(this.group) && guild.isCommandEnabled(this);
	}

	reload() {
		const path = `${ this.client.registry.commandsPath }/${ this.group.name }/${ this.name }.js`;
		delete require.cache[path];
		const command = require(path);

		this.client.registry.registerCommand(command);
	}
};