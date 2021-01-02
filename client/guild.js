const { Structures } = require("discord.js");

module.exports = Structures.extend("Guild", Guild => {
	return class extends Guild {
		constructor(...args) {
			super(...args);
			this._commandPrefix = null;
			this._commandsEnabled = new Map();
			this._groupsEnabled = new Map();
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
	}
});