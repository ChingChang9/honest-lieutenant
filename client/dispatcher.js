const prefixless = require("@/commands/prefixless/index.js");

module.exports = class Dispatcher {
	constructor(client, registry) {
		this.client = client;
		this.registry = registry;
		this._editable = new Map();
	}

	handleMessage(message, oldMessage) {
		if (message.author.bot || message.partial || message.content === oldMessage?.content ||
			oldMessage && !this._editable.has(oldMessage.id) || message.webhookID) return;

		this.cacheMessage(message, oldMessage);
		const prefixRegex = this.getPrefixRegex(message.guild);

		const matches = message.content.match(prefixRegex);
		if (!matches) return prefixless.run(message);

		const command = this.registry.findCommand(matches[2]);
		if (!command) return;
		const argString = message.content.slice(matches[0].length + 1);
		message.initCommand(command, argString);
	}

	cacheMessage(message) {
		this._editable.get(message.id)?.close();
		this._editable.set(message.id, setTimeout(() => {
			this._editable.delete(message.id);
		}, 30 * 1000));
	}

	getPrefixRegex(guild) {
		const prefix = guild?.commandPrefix || this.client.commandPrefix;
		const escapedPrefix = prefix.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
		return new RegExp(`^(<@!?${ this.client.user.id }>\\s*(?:${ escapedPrefix }\\s*)?|${ escapedPrefix }\\s*)([^\\s]+)`, "i");
	}
};