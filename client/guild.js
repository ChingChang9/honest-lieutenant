const { Structures } = require("discord.js");
const { database } = require("@/workers/firebase.js");
const { clientId } = require("@/config.json");

module.exports = Structures.extend("Guild", Guild => class extends Guild {
	constructor(...args) {
		super(...args);
		this._commandPrefix = null;
		this._disabledCommands = new Set();
		this._disabledGroups = new Set();
		this.queue = [];
		this.queueKeys = [];
		this.played = 0;
		this.spamRate = {};

		const queueRef = database.ref(`guilds/${ this.id }/queue`);
		const playedRef = database.ref(`guilds/${ this.id }/played`);

		this.queueRef = queueRef;
		queueRef.on("value", snapshot => {
			const queueVal = snapshot.val() || {};
			this.queue = Object.values(queueVal);
			this.queueKeys = Object.keys(queueVal);
		});
		playedRef.on("value", snapshot => {
			this.played = snapshot.val();
		});
	}

	get clientName() {
		return this.members.cache.get(clientId).displayName;
	}

	set commandPrefix(prefix) {
		this._commandPrefix = prefix;
	}

	get commandPrefix() {
		return this._commandPrefix || this.client.commandPrefix;
	}

	setSpamRate(command, rate) {
		if (rate === "default" || rate === this.client.spamRate[command]) {
			delete this.spamRate[command];
			return this.client.spamRate[command] * 100;
		} else {
			this.spamRate[command] = rate / 100;
			return rate;
		}
	}

	getSpamRate(command) {
		return command in this.spamRate ? this.spamRate[command] : this.client.spamRate[command];
	}

	setCommandDisabled(command, disabled) {
		if (disabled) return this._disabledCommands.add(command.name);
		this._disabledCommands.delete(command.name);
	}

	isCommandDisabled(command) {
		return this._disabledCommands.has(command.name);
	}

	setGroupDisabled(group, disabled) {
		if (disabled) return this._disabledGroups.add(group.name);
		this._disabledGroups.delete(group.name);
	}

	isGroupDisabled(group) {
		return this._disabledGroups.has(group.name);
	}
});