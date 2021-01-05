const { Structures } = require("discord.js");
const { database } = require("@/scripts/firebase.js");

module.exports = Structures.extend("Guild", Guild => {
	return class extends Guild {
		constructor(...args) {
			super(...args);
			this._commandPrefix = null;
			this._commandsEnabled = new Map();
			this._groupsEnabled = new Map();
			this.queue = [];
			this.queueKeys = [];
			this.played = 0;

			const queueRef = database.ref(`${ this.id }/queue`);
			const playedRef = database.ref(`${ this.id }/played`);

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

		get commandPrefix() {
			return this._commandPrefix || this.client.commandPrefix;
		}

		set commandPrefix(prefix) {
			this._commandPrefix = prefix;
		}

		setCommandEnabled(command, enabled) {
			this._commandsEnabled.set(command.name, enabled);
		}

		isCommandEnabled(command) {
			return this._commandsEnabled.get(command.name);
		}

		setGroupEnabled(group, enabled) {
			this._groupsEnabled.set(group.id, enabled);
		}

		isGroupEnabled(group) {
			return this._groupsEnabled.get(group.id);
		}
	};
});